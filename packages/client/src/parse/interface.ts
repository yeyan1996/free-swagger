import { OpenAPIV2 } from 'openapi-types'
import {
  schemaToTsType,
  ParsedSchemaObject,
  traverseTree,
  TYPE_MAP,
  SPECIAL_CHARACTERS_MAP_OPEN,
  SPECIAL_CHARACTERS_MAP_CLOSE,
} from '../utils'
import { omit } from 'lodash'

type ParsedInterfaceProp = Omit<ParsedSchemaObject, 'isBinary'>

export interface ParsedInterface {
  name: string
  props: { [prop: string]: ParsedInterfaceProp }
  hasGeneric?: boolean
  skipGenerate?: boolean
}

export interface ParsedInterfaceName {
  interface: string
  generic: string
  hasGeneric: boolean
}

export interface InterfaceNameItem {
  name: string
  generics?: InterfaceNameItem[]
}

// 补充内建 Java 类型
const buildInInterfaces: { [key: string]: { name: string; code: string } } = {
  Map: {
    name: 'JavaMap',
    code: `
   export type JavaMap<T, U> = Record<string, U>
  `,
  },
  List: {
    name: 'JavaList',
    code: `
   export type JavaList<T> = Array<T>
  `,
  },
}

let map: { [key: string]: ParsedInterface } = {}
let genericInterfaceMap: { [key: string]: ParsedInterface } = {}
let recursiveMap: { [key: string]: ParsedInterface } = {}

const findInterface = (interfaceName: string) =>
  genericInterfaceMap[interfaceName] ||
  map[interfaceName] ||
  recursiveMap[interfaceName]

const resetInterfaceMap = () => {
  map = {}
  genericInterfaceMap = {}
  recursiveMap = {}
}

// 将 interface 解析成数组
const parseInterfaceName = (interfaceName: string): InterfaceNameItem => {
  const stack: (InterfaceNameItem | string)[] = []
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
      const generics: InterfaceNameItem[] = []
      // @ts-ignore
      while (!isOpenCharacter(lasted) && stack.length > 0) {
        lasted = stack.pop()
        if (typeof lasted === 'string' && !isOpenCharacter(lasted)) {
          generics.unshift({ name: lasted })
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
          stack.push({ name, generics })
        }
      }
      if (stack.length === 1) return stack[0] as InterfaceNameItem
    } else {
      word += s
    }
  }
  return { name: word }
}

// 取出 interface 中所有 interfaceName （排除泛型名）
const flatInterfaceName = (interfaceName: string) => {
  const interfaceNames: string[] = []
  traverseTree(parseInterfaceName(interfaceName), (interfaceNameItem) => {
    interfaceNames.push(interfaceNameItem.name)
  })
  return interfaceNames
}

// 将数组转成 interface
const reduceInterfaceName = (tree: InterfaceNameItem): string => {
  if (tree.generics) {
    return `${tree.name}<${tree.generics
      .map((child) => reduceInterfaceName(child))
      .join(',')}>`
  } else {
    return tree.name
  }
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
    const { imports, type } = schemaToTsType(schema)
    res[propertyKey] = {
      type,
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

const shouldSkipGenerate = (interfaceName: string, noContext = false) => {
  const res = parseInterfaceName(interfaceName)
  // 没有泛型则直接不跳过生成
  if (!res.generics?.length) {
    return false
  }
  // 没有上下文的泛型直接跳过生成
  if (noContext) return true
  return flatInterfaceName(interfaceName).every(
    (item) => TYPE_MAP[item] || map[item] || recursiveMap[item]
  )
}

const parseInterface = (
  definitions: OpenAPIV2.DefinitionsObject,
  interfaceName: string,
  recursive = false
) => {
  const currentMap = recursive ? recursiveMap : map
  const res = parseInterfaceName(interfaceName)

  const parsedInterface: ParsedInterface = {
    name: res.generics?.length ? `${res.name}<T>` : res.name,
    props: {},
    hasGeneric: !!res.generics?.length,
    skipGenerate: Object.keys(buildInInterfaces).includes(res.name),
  }

  if (parsedInterface.skipGenerate) return parsedInterface

  const { properties, required } = definitions[interfaceName]
  if (!properties) return parsedInterface

  if (parsedInterface.hasGeneric) {
    if (genericInterfaceMap[res.name]) {
      parsedInterface.skipGenerate = true
      return
    } else {
      const genericKey = findGenericKey(properties)
      parsedInterface.props = genericKey
        ? {
            [genericKey]: {
              type: properties[genericKey].type === 'array' ? 'T[]' : 'T',
              imports: [],
              required: required?.includes(genericKey) || false,
              description: properties[genericKey].description || '',
            },
            ...parseProperties(omit(properties, genericKey), required),
          }
        : parseProperties(properties, required)
      // 如果是包含泛型的接口，则删除 recursiveMap/map 中的类型
      // todo 更好的实现方式？
      if (recursiveMap[res.name]) {
        delete recursiveMap[res.name]
      }
      if (map[res.name]) {
        delete map[res.name]
      }
      genericInterfaceMap[res.name] = parsedInterface
      return
    }
  }
  parsedInterface.props = parseProperties(properties, required)
  currentMap[res.name] = parsedInterface
}

export {
  parseInterface,
  shouldSkipGenerate,
  map,
  recursiveMap,
  genericInterfaceMap,
  buildInInterfaces,
  findInterface,
  resetInterfaceMap,
  flatInterfaceName,
  formatGenericInterface,
}
