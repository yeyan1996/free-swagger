import { OpenAPIV2 } from 'openapi-types'
import {
  ParsedSchemaObject,
  schemaToTsType,
  traverseTree,
  TYPE_MAP,
  SPECIAL_CHARACTERS_MAP_OPEN,
  SPECIAL_CHARACTERS_MAP_CLOSE,
  extractInterfaceNameByRef,
  getRef,
} from '../utils'
import { cloneDeep, uniq, flatten } from 'lodash'
import { Type } from '../compile/type'

const isWord = /^\w*$/

type ParsedInterfaceProp = Omit<ParsedSchemaObject, 'isBinary'>

export interface ParsedInterface {
  name: string
  formatName: string
  props?: { [prop: string]: ParsedInterfaceProp }
  generics?: ParsedInterface[]
  code?: string
  description?: string
}

const GENERIC_LIST = ['T', 'U', 'V']

// 补充内建类型
// 加上前缀，防止 Swagger Map 和 JavaScript Map 冲突
const buildInInterfaces: Record<
  string,
  { name: string; formatName: string; code: string; jsDocCode: string }
> = {
  Map: {
    name: 'Map',
    formatName: 'SwaggerMap',
    code: `
   export type SwaggerMap<T extends string | symbol | number, U> = Record<T, U>
  `,
    // TODO: JSDOC 泛型补充
    jsDocCode: `
/**
 * @typedef {object} SwaggerMap
 **/`,
  },
  List: {
    name: 'List',
    formatName: 'SwaggerList',
    code: `
   export type SwaggerList<T> = Array<T>
  `,
    jsDocCode: `
/**
 * @typedef {Array} SwaggerList
 **/`,
  },
}

// 解析 interface
// interface 名 => 树形数组
const parseInterfaceName = (interfaceName: string): ParsedInterface => {
  const stack: (ParsedInterface | string)[] = []
  let word = ''
  const isOpenCharacter = (character: string) =>
    Object.keys(SPECIAL_CHARACTERS_MAP_OPEN).includes(character)
  const isCloseCharacter = (character: string) =>
    Object.keys(SPECIAL_CHARACTERS_MAP_CLOSE).includes(character)

  for (const s of interfaceName.split('')) {
    if (isOpenCharacter(s)) {
      stack.push(word)
      word = ''
      stack.push(s)
    } else if (s === ',') {
      if (word) {
        stack.push(word)
        word = ''
      }
    } else if (isCloseCharacter(s)) {
      // 遇到闭合标签，找到距离最近的开合标签之间的所有泛型，拼接，组成 generics 数组
      // 思路参考函数参数优先级
      // 深度遍历到最底层的参数，从下往上合并参数
      // f(a,b,f(c,d,f(f(e),g)))
      if (word) {
        stack.push(word)
        word = ''
      }
      let lasted
      const generics: ParsedInterface[] = []
      // @ts-ignore
      while (!isOpenCharacter(lasted) && stack.length > 0) {
        lasted = stack.pop()
        if (typeof lasted === 'string' && !isOpenCharacter(lasted)) {
          generics.unshift({ name: lasted, formatName: lasted })
        } else {
          // @ts-ignore
          if (!isOpenCharacter(lasted)) {
            // @ts-ignore
            generics.unshift(lasted)
          }
        }
      }
      if (stack.length) {
        const name = stack.pop()
        if (typeof name === 'string') {
          stack.push({
            name,
            formatName: name,
            generics,
          })
        }
      }
      if (stack.length === 1) return stack[0] as ParsedInterface
    } else {
      word += s
    }
  }
  return { name: word, formatName: word }
}

// 还原 interface
// 树形数组 => interface 名
const reduceInterfaceName = (tree: ParsedInterface): string => {
  if (tree.generics) {
    return `${tree.formatName}<${tree.generics
      .map((child) => reduceInterfaceName(child))
      .join(',')}>`
  } else {
    return tree.formatName
  }
}

// 取出 interface 中所有 interfaceName
const flatInterfaceName = (interfaceName: string) => {
  const interfaceNames: string[] = []
  traverseTree(parseInterfaceName(interfaceName), (interfaceNameItem) => {
    interfaceNames.push(interfaceNameItem.name)
  })
  return interfaceNames
}

// 过滤需导入的 interface
// import {A} from 'xxx'
const uniqInterfaceNameImports = (imports: string[]) =>
  uniq(
    flatten(
      imports.map((item) =>
        flatInterfaceName(item)
          // 排除 ts 内置类型
          .filter((item) => !Object.values(TYPE_MAP).includes(item))
          // 排除一些特殊的泛型 Map<string,string>
          .filter((item) => isWord.test(item))
          // 如果是内建类型则转换成自定义泛型
          .map((item) =>
            buildInInterfaces[item] ? buildInInterfaces[item].formatName : item
          )
      )
    )
  )

// 是否根据 prefix + generic 生成 prefix 的 interface
// 例如 PagedResultDto[AuditLogListDto] 在 definitions 中已定义
// 可以额外生成 PagedResultDto（PagedResultDto 未在 definitions 中定义）
const shouldGenerateUndefinedDefinition = (
  definitions: OpenAPIV2.DefinitionsObject,
  interfaceNamePrefix: string
) =>
  Object.keys(definitions)
    .filter((key) => key.startsWith(interfaceNamePrefix))
    .some((key) => {
      const [firstname] = flatInterfaceName(key)
      return interfaceNamePrefix === firstname
    })

const normalizeName = (name: string) => {
  if (buildInInterfaces[name]) {
    return buildInInterfaces[name].formatName
  }
  if (TYPE_MAP[name]) {
    return TYPE_MAP[name]
  }
  return name
}

// 格式化含有泛型的接口
// 同时内建的类型转成 自定义/TS 内建泛型
// Animal«Dog» -> Animal<Dog>
const formatGenericInterface = (interfaceName: string): string => {
  const tree = parseInterfaceName(interfaceName)
  traverseTree(tree, (interfaceItem) => {
    interfaceItem.formatName = normalizeName(interfaceItem.name)
  })
  return reduceInterfaceName(tree)
}

const parseProperties = (
  properties: Record<string, OpenAPIV2.SchemaObject>,
  required?: string[]
): Record<string, ParsedInterfaceProp> => {
  const res: Record<string, ParsedInterfaceProp> = {}
  Object.keys(properties).forEach((propertyKey) => {
    const schema = properties[propertyKey]
    const { type, formatType, ref } = schemaToTsType(schema)
    res[propertyKey] = {
      type,
      formatType,
      ref,
      required: required?.includes(propertyKey) || false,
      description: schema.description || '',
    }
  })
  return res
}

/**
 * @description 找到一个 interface 中泛型占位符的那个属性名（小概率存在多个属性）
 * @example
 * interface ExampleInterface<A> {
 *    a:A  <- 属性名为 a
 *    b:string
 *    c:string
 * }
 **/
const findGenericKeys = (
  properties: Record<string, OpenAPIV2.SchemaObject>,
  parsedInterface: ParsedInterface
): string[] => {
  const res: string[] = []
  const keys = Object.keys(properties)
  const notGeneric = (generic: string) => TYPE_MAP[generic]

  parsedInterface.generics?.forEach((item) => {
    const restInterfaceName = reduceInterfaceName(item)

    // 非泛型只能找 interface 的 props 中第一个匹配的属性名作为占位符了
    // 例如 List<string> 中的 string
    if (notGeneric(item.name)) {
      const index = keys.findIndex((key) => {
        return properties[key].type === item.name
      })
      if (index < 0) return
      res.push(keys[index])
      return
    }

    // 对 List 做特殊处理
    // TODO: Map 没有具体场景暂时不处理
    if (item.name === 'List') {
      const index = keys.findIndex((key) => {
        return (
          (properties[key].type === 'array' &&
            // { $ref:'#/definitions/Qwe' } 匹配 Qwe 泛型
            extractInterfaceNameByRef(properties[key].items?.$ref ?? '') ===
              item.generics?.[0].name) ??
          ''
        )
      })
      if (index < 0) return
      res.push(keys[index])
    } else {
      const index = keys.findIndex((key) => {
        return (
          // 泛型为类对象
          getRef(properties[key].$ref ?? '') === restInterfaceName ||
          // 泛型为类列表
          getRef(properties[key].items?.$ref ?? '') === restInterfaceName
        )
      })
      if (index < 0) return
      res.push(keys[index])
    }
  })
  return res
}

// 解析 interface & 找到泛型的 prop
const normalizeProperties = (
  properties: Record<string, OpenAPIV2.SchemaObject>,
  genericKeys: string[],
  required?: string[]
): Record<string, ParsedInterfaceProp> => {
  // 从 definition 中找到替换为泛型的 key
  // const genericKey = findGenericKey(properties)
  const res = cloneDeep(parseProperties(properties, required))
  genericKeys.forEach((key, index) => {
    res[key] = {
      type: properties[key].type,
      formatType:
        properties[key].type === 'array'
          ? `${GENERIC_LIST[index]}[]`
          : GENERIC_LIST[index],
      ref: res[key].ref,
      required: required?.includes(key) || false,
      description: properties[key].description || '',
    }
  })
  return res
}

const parseInterface = (
  definitions: OpenAPIV2.DefinitionsObject,
  interfaceName: string,
  type: Type
): ParsedInterface => {
  const parsedInterface = parseInterfaceName(interfaceName)
  const {
    properties: topProperties,
    allOf,
    // additionalProperties: topAdditionalProperties,
    required: topRequired,
    description,
  } = definitions[interfaceName]
  parsedInterface.description = description

  // definitions 中存在 Map«string,object»
  const buildInInterface = buildInInterfaces[parsedInterface.name]
  if (buildInInterface) {
    return {
      code:
        type === 'interface'
          ? buildInInterface.code
          : buildInInterface.jsDocCode,
      ...parsedInterface,
    }
  }

  const topProps = (allOf?.find((item) => item.type)?.properties ??
    topProperties) as Record<string, OpenAPIV2.SchemaObject>

  // 枚举类型
  if (!topProps) {
    if (type === 'interface') {
      return {
        code: `${
          description ? `/** ${description} */\n` : ''
        }export type ${interfaceName} = ${
          schemaToTsType(definitions[interfaceName]).formatType
        }`,
        ...parsedInterface,
      }
    } else {
      return {
        code: `/**
  * @typedef {(${
    schemaToTsType(definitions[interfaceName]).formatType
  })} ${interfaceName}${description ? ` - ${description}` : ''}
**/`,
        ...parsedInterface,
      }
    }
  }

  // interface 存在泛型
  if (parsedInterface.generics?.length) {
    traverseTree(parsedInterface, (node, index) => {
      // definitions 中存在 Map«string,object»
      const buildInInterface = buildInInterfaces[node.name]
      // 内建 interface
      if (buildInInterface) {
        node.code =
          type === 'interface'
            ? buildInInterface.code
            : buildInInterface.jsDocCode
      } else if (definitions[node.name]) {
        /**
         * @description 在 definitions 中已定义的 interface
         * @description
         * 如果是最顶层的 definition，优先使用 prefix + generic 的定义
         * 没有则回退到 prefix 的定义
         * 因为 prefix + generic 可能会标示出泛型位置，而 prefix 不一定有
         * @example
         * 解析 ListResult«AppBo»
         * 优先查找 ListResult«AppBo»，没有则回退到 ListResult
         **/
        const { properties, required } =
          index === 0 && definitions[interfaceName]
            ? definitions[interfaceName]
            : definitions[node.name]
        if (!properties) return
        node.props = normalizeProperties(
          properties,
          findGenericKeys(properties, parsedInterface),
          required
        )
      } else if (shouldGenerateUndefinedDefinition(definitions, node.name)) {
        // 未定义的 interface
        node.props = normalizeProperties(
          topProps,
          findGenericKeys(topProps, parsedInterface),
          topRequired
        )
      }
      node.formatName = `${normalizeName(node.name)}${
        node.generics?.length
          ? `<${node.generics
              ?.map((_, index) => GENERIC_LIST[index])
              .join(',')}>`
          : ''
      }`
    })
  } else {
    // interface 不存在泛型
    parsedInterface.props = normalizeProperties(topProps, [], topRequired)
  }
  return parsedInterface
}

export {
  buildInInterfaces,
  parseInterfaceName,
  parseInterface,
  flatInterfaceName,
  formatGenericInterface,
  uniqInterfaceNameImports,
}
