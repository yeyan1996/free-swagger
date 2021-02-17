import { OpenAPIV2 } from 'openapi-types'
import {
  ParsedSchemaObject,
  schemaToTsType,
  traverseTree,
  TYPE_MAP,
  SPECIAL_CHARACTERS_MAP_OPEN,
  SPECIAL_CHARACTERS_MAP_CLOSE,
} from '../utils'
import { omit } from 'lodash'

type ParsedInterfaceProp = Omit<ParsedSchemaObject, 'isBinary'>

export interface ParsedInterface {
  name: string
  formatName: string
  props?: { [prop: string]: ParsedInterfaceProp }
  generics?: ParsedInterface[]
  code?: string
}

// 补充内建 Java 类型
const buildInInterfaces: { [key: string]: { name: string; code: string } } = {
  Map: {
    name: 'JavaMap',
    code: `
   export type JavaMap<T, U> = Record<T, U>
  `,
  },
  List: {
    name: 'JavaList',
    code: `
   export type JavaList<T> = Array<T>
  `,
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
            formatName: generics?.length ? `${name}<T>` : name,
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
    return `${tree.name}<${tree.generics
      .map((child) => reduceInterfaceName(child))
      .join(',')}>`
  } else {
    return tree.name
  }
}

// 取出 interface 中所有 interfaceName （排除泛型名）
const flatInterfaceName = (interfaceName: string) => {
  const interfaceNames: string[] = []
  traverseTree(parseInterfaceName(interfaceName), (interfaceNameItem) => {
    interfaceNames.push(interfaceNameItem.name)
  })
  return interfaceNames
}

// 格式化含有泛型的接口
// 同时 Java 内建的类型转成 自定义/TS 内建泛型
// Animal«Dog» -> Animal<Dog>
const formatGenericInterface = (interfaceName: string): string => {
  const tree = parseInterfaceName(interfaceName)
  traverseTree(tree, (interfaceItem) => {
    if (buildInInterfaces[interfaceItem.name]) {
      interfaceItem.name = buildInInterfaces[interfaceItem.name].name
    }
    if (TYPE_MAP[interfaceItem.name]) {
      interfaceItem.name = TYPE_MAP[interfaceItem.name]
    }
  })
  return reduceInterfaceName(tree)
}

const parseProperties = (
  properties: { [key: string]: OpenAPIV2.SchemaObject },
  requiredList?: string[]
) => {
  const res: { [key: string]: ParsedInterfaceProp } = {}
  Object.keys(properties).forEach((propertyKey) => {
    const schema = properties[propertyKey]
    const { imports, type, formatType } = schemaToTsType(schema)
    res[propertyKey] = {
      type,
      formatType,
      imports,
      required: requiredList?.includes(propertyKey) || false,
      description: schema.description || '',
    }
  })
  return res
}

// 找到 definitions[interfaceName].properties 中泛型的那个属性名
const findGenericKey = (properties: {
  [key: string]: OpenAPIV2.SchemaObject
}): string | undefined => {
  const index = Object.keys(properties).findIndex(
    (key) =>
      properties[key].$ref ||
      (properties[key].type === 'array' && properties[key].items?.$ref)
  )
  return Object.keys(properties)[index]
}

const normalizeProperties = (
  properties: { [key: string]: OpenAPIV2.SchemaObject },
  required?: string[]
) => {
  // 从 definition 中找到替换为泛型的 key
  const genericKey = findGenericKey(properties)
  return genericKey
    ? {
        [genericKey]: {
          type: properties[genericKey].type,
          formatType: properties[genericKey].type === 'array' ? 'T[]' : 'T',
          imports: [],
          required: required?.includes(genericKey) || false,
          description: properties[genericKey].description || '',
        },
        ...parseProperties(omit(properties, genericKey), required),
      }
    : parseProperties(properties, required)
}

const parseInterface = (
  definitions: OpenAPIV2.DefinitionsObject,
  interfaceName: string
): Required<ParsedInterface> => {
  const parsedInterface = parseInterfaceName(interfaceName)
  if (!definitions[interfaceName]) {
    throw new Error(`can not find ${interfaceName} in definitions`)
  }
  const { properties: topProperties, required: topRequired } = definitions[
    interfaceName
  ]
  if (topProperties) {
    if (parsedInterface.generics?.length) {
      traverseTree(parsedInterface, (node) => {
        if (buildInInterfaces[node.name]) {
          node.code = buildInInterfaces[node.name].code
          return
        }
        if (definitions[node.name]) {
          const { properties, required } = definitions[node.name]
          if (!properties) return
          node.props = normalizeProperties(properties, required)
        } else {
          node.props = normalizeProperties(topProperties, topRequired)
        }
      })
    } else {
      parsedInterface.props = parseProperties(topProperties, topRequired)
    }
  } else {
    parsedInterface.props = normalizeProperties(definitions[interfaceName])
  }
  return parsedInterface as Required<ParsedInterface>
}

export {
  buildInInterfaces,
  parseInterfaceName,
  parseInterface,
  flatInterfaceName,
  formatGenericInterface,
}
