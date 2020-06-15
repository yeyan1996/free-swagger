import { OpenAPIV2 } from 'openapi-types'
import prettier from 'prettier/standalone'
import parserTypescript from 'prettier/parser-typescript'
import parserBabel from 'prettier/parser-babel'
import {
  buildInInterfaces,
  generateInterfaceName,
  parseInterfaceName,
} from './parse/interface'

export interface ConfigClient {
  source: OpenAPIV2.Document
  templateFunction?: TemplateFunction
  lang?: 'js' | 'ts'
}

export interface TemplateFunction {
  (config: TemplateConfig): string
}

export interface TemplateConfig {
  url: string
  summary: string
  method: string
  name: string
  responseType: string
  deprecated: boolean
  pathParams: string[]
  IResponse: string
  IParams: string
  IPathParams: string
}
export interface ParsedSchemaObject {
  type: string
  imports: string[]
  required: boolean
  description: string
  isBinary?: boolean
  isGeneric?: boolean
}

export type ParsedSchema =
  | {
      [key: string]: ParsedSchemaObject
    }
  | ParsedSchemaObject

const SPECIAL_CHARACTERS_MAP: { [key: string]: string } = {
  '«': '<',
  '»': '>',
  '[': '<',
  ']': '>',
  '{': '<',
  '}': '>',
}

const SPECIAL_CHARACTERS_MAP_REG = new RegExp(
  `[${Object.keys(SPECIAL_CHARACTERS_MAP).join('\\')}]`,
  'g'
)
const hasGeneric = (interfaceName: string) =>
  SPECIAL_CHARACTERS_MAP_REG.test(interfaceName)

// openApi 类型 => ts 类型
const TYPE_MAP: { [key: string]: string } = {
  boolean: 'boolean',
  bool: 'boolean',
  Boolean: 'boolean',
  Int64: 'number',
  integer: 'number',
  number: 'number',
  string: 'string',
  file: 'Blob',
  formData: 'FormData',
}

// 格式化含有泛型的接口
// 同时 Java 内建的类型转成自定义泛型
// Animal«Dog» -> Animal<Dog>
const formatGenericInterface = (definitionClassName: string): string =>
  generateInterfaceName(
    parseInterfaceName(
      definitionClassName.replace(
        SPECIAL_CHARACTERS_MAP_REG,
        ($0) => SPECIAL_CHARACTERS_MAP[$0]
      )
    ).map((item) => ({
      ...item,
      interface: buildInInterfaces[item.interface]
        ? buildInInterfaces[item.interface].name
        : item.interface,
    }))
  )

// 获取 $ref 指向的类型
// /definitions/ref -> ref
const getRef = (ref: OpenAPIV2.ReferenceObject['$ref']): string => {
  const propType = ref.slice(ref.lastIndexOf('/') + 1)
  return formatGenericInterface(propType)
}

const isRef = (schema?: any): schema is OpenAPIV2.ReferenceObject =>
  schema && !!schema.$ref

// 找到 schema 对应的 Ts 类型 & 找到需要导入的 interface 名
const schemaToTsType = (
  schema?: OpenAPIV2.SchemaObject
): ParsedSchemaObject => {
  if (!schema)
    return {
      type: 'any',
      imports: [],
      isBinary: false,
      required: false,
      description: '',
    }
  const imports: string[] = []

  const recursive = (schema: OpenAPIV2.SchemaObject): string => {
    if (schema.$ref) {
      const isWord = /^\w*$/
      const originRef = getRef(schema.$ref)
      imports.push(
        ...parseInterfaceName(originRef)
          .map((item) => item.interface)
          // 过滤出 interface
          .filter((item) => !Object.keys(TYPE_MAP).includes(item))
          // 排除一些特殊的泛型 Map<string,string>
          .filter((item) => isWord.test(item))
          // 如果是 Java 内建类型则转换成自定义泛型
          .map((item) =>
            buildInInterfaces[item] ? buildInInterfaces[item].name : item
          )
      )
      return originRef
    }
    if (!schema.type) return 'any'

    if (schema.type === 'array' && schema.items) {
      return `${recursive(schema.items)}[]`
    }
    // todo 对 object 的响应 schema 做处理
    if (schema.type === 'object') {
      let type = ''
      if (!schema.properties) return 'object'
      Object.keys(schema.properties).forEach((key) => {
        type += schema.properties ? recursive(schema.properties[key]) : ''
      })
      return type
    }
    if (schema.enum) {
      return schema.enum.map((value) => `"${value}"`).join(' | ')
    }

    // 极小情况下的容错
    if (Array.isArray(schema.type)) {
      return JSON.stringify(schema.type)
    }
    // 基本类型
    return TYPE_MAP[schema.type]
  }

  return {
    type: recursive(schema),
    imports,
    isBinary: schema.type === 'file',
    required: false,
    description: '',
  }
}

const formatCode = (lang: 'ts' | 'js') => (code: string): string =>
  prettier.format(code, {
    plugins: [parserBabel, parserTypescript],
    printWidth: 120,
    tabWidth: 2,
    parser: lang === 'ts' ? 'typescript' : 'babel',
    trailingComma: 'none',
  })

export {
  formatCode,
  formatGenericInterface,
  getRef,
  isRef,
  schemaToTsType,
  TYPE_MAP,
  hasGeneric,
}
