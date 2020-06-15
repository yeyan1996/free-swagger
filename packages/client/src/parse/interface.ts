import { OpenAPIV2 } from 'openapi-types'
import { schemaToTsType, ParsedSchemaObject, hasGeneric } from '../utils'
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

// 补充内建 Java 类型
const buildInInterfaces: { [key: string]: { name: string; code: string } } = {
  Map: {
    name: 'JavaMap',
    code: `
    export interface JavaMap<T,U>{
        [key:T]:U
    }
  `,
  },
  List: {
    name: 'JavaList',
    code: `
    export interface JavaList<T>{
        [index:number]:T
    }
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
const parseInterfaceName = (interfaceName: string) => {
  const res: ParsedInterfaceName[] = []
  const recursive = (name: string) => {
    if (!name) return
    const index = name.search(/[«<\[]/g)
    const hasGeneric = index !== -1
    const generic = hasGeneric ? name.slice(index + 1, name.length - 1) : ''
    res.push({
      interface: hasGeneric ? name.slice(0, index) : name,
      generic,
      hasGeneric,
    })
    recursive(generic)
  }
  recursive(interfaceName)
  return res
}

// 将数组转成 interface
const generateInterfaceName = (list: ParsedInterfaceName[]) =>
  list.reduceRight(
    (acc, cur) => `${cur.interface}${acc ? `<${acc}>` : acc}`,
    ''
  )

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

const shouldSkipGenerate = (interfaceName: string) => {
  const res = parseInterfaceName(interfaceName)
  // 没有泛型则直接不跳过
  if (!res[0].hasGeneric) {
    return false
  }
  return res.every(
    (item) => map[item.interface] || recursiveMap[item.interface]
  )
}

const parseInterface = (
  definitions: OpenAPIV2.DefinitionsObject,
  interfaceName: string,
  recursive = false
) => {
  const currentMap = recursive ? recursiveMap : map
  const [item] = parseInterfaceName(interfaceName)

  if (hasGeneric(item.generic)) {
    parseInterface(definitions, item.generic, true)
  }

  const parsedInterface: ParsedInterface = {
    name: item.hasGeneric ? `${item.interface}<T>` : item.interface,
    props: {},
    hasGeneric: item.hasGeneric,
    skipGenerate: Object.keys(buildInInterfaces).includes(item.interface),
  }

  if (parsedInterface.skipGenerate) return parsedInterface

  const { properties, required } = definitions[interfaceName]
  if (!properties) return parsedInterface

  if (parsedInterface.hasGeneric) {
    if (genericInterfaceMap[item.interface]) {
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
      // todo 如果是包含泛型的接口，则删除 recursiveMap/map 中的类型
      if (recursiveMap[item.interface]) {
        delete recursiveMap[item.interface]
      }
      if (map[item.interface]) {
        delete map[item.interface]
      }
      genericInterfaceMap[item.interface] = parsedInterface
      return
    }
  }
  parsedInterface.props = parseProperties(properties, required)
  currentMap[item.interface] = parsedInterface
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
  parseInterfaceName,
  generateInterfaceName,
}
