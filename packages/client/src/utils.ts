import { OpenAPIV2 } from 'openapi-types'
import prettier from 'prettier/standalone'
import parserTypescript from 'prettier/parser-typescript'
import parserBabel from 'prettier/parser-babel'
import { formatGenericInterface } from './parse/interface'

export interface ClientConfig<T = OpenAPIV2.Document> {
  source: T
  templateFunction?: TemplateFunction
  lang?: 'js' | 'ts'
  jsDoc?: boolean
  // type
  typedef?: boolean
  interface?: boolean
  recursive?: boolean
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
  IQueryParams: string
  IBodyParams: string
  IPathParams: string
}
export interface ParsedSchemaObject {
  type: string | string[] | undefined // 原始 type，对应 swagger 中的 type
  formatType: string // 最终展示的 type
  ref: string // 用于标识引用，定位 definitions 中对应 interface，对应未 format 的 $ref 属性
  required: boolean
  description: string
  isBinary?: boolean
}

export type ParsedSchema =
  | Record<string, ParsedSchemaObject>
  | ParsedSchemaObject

const SPECIAL_CHARACTERS_MAP_OPEN: Record<string, string> = {
  '«': '<',
  '[': '<',
  '{': '<',
  '<': '<',
}

const SPECIAL_CHARACTERS_MAP_CLOSE: Record<string, string> = {
  '»': '>',
  ']': '>',
  '}': '>',
  '>': '>',
}

// openApi 类型 => ts 类型
const TYPE_MAP: Record<string, string> = {
  boolean: 'boolean',
  bool: 'boolean',
  Boolean: 'boolean',
  long: 'number',
  double: 'number',
  Int64: 'number',
  integer: 'number',
  number: 'number',
  string: 'string',
  bigdecimal: 'string',
  LocalDate: 'string',
  file: 'Blob',
  formData: 'FormData',
  Void: 'void',
  object: 'object',
  array: 'Array<any>',
}

const traverseTree = <T extends Record<string, any>>(
  tree: T,
  cb: (node: T, index: number, top: T) => any,
  childrenKey = 'generics'
): void => {
  const top = tree
  let index = 0
  const recursive = (
    tree: T,
    cb: (node: T, index: number, top: T) => any,
    childrenKey = 'generics'
  ) => {
    cb(tree, index, top)
    index++
    if (tree[childrenKey]) {
      tree[childrenKey].forEach((child: T) => {
        recursive(child, cb, childrenKey)
      })
    }
  }
  recursive(tree, cb, childrenKey)
}

// 提取 $ref 中的 interface
// /definitions/Qwe«A» -> Qwe«A»
const extractInterfaceNameByRef = (
  ref: OpenAPIV2.ReferenceObject['$ref']
): string => {
  return ref.slice(ref.lastIndexOf('/') + 1)
}

// 提取 $ref 中的 interface 并格式化
// /definitions/Qwe«A» -> Qwe<A>
const getRef = (ref: OpenAPIV2.ReferenceObject['$ref']): string => {
  const interfaceName = extractInterfaceNameByRef(ref)
  return formatGenericInterface(interfaceName)
}

const isRef = (schema?: any): schema is OpenAPIV2.ReferenceObject =>
  schema && !!schema.$ref

// 找到 schema 对应的 TS 类型 & 找到需要导入的 interface 名
const schemaToTsType = (
  schema?: OpenAPIV2.SchemaObject
): ParsedSchemaObject => {
  if (!schema)
    return {
      type: 'any',
      ref: '',
      formatType: 'any',
      isBinary: false,
      required: false,
      description: '',
    }
  const recursive = (
    schema: OpenAPIV2.SchemaObject,
    formatType = true
  ): string => {
    if (schema.$ref) {
      if (!formatType) {
        return extractInterfaceNameByRef(schema.$ref)
      }
      return getRef(schema.$ref)
    }
    if (!schema.type) return 'any'

    // 极小情况下的容错
    if (Array.isArray(schema.type)) {
      return JSON.stringify(schema.type)
    }

    if (!formatType) {
      return schema.type
    }

    if (schema.type === 'array' && schema.items) {
      return schema.items.enum
        ? `(${recursive(schema.items, formatType)})[]`
        : `${recursive(schema.items, formatType)}[]`
    }
    // todo 对 object 的响应 schema 做处理
    if (schema.type === 'object') {
      let type = ''
      if (!schema.properties) return 'object'
      Object.keys(schema.properties).forEach((key) => {
        type += schema.properties
          ? recursive(schema.properties[key], formatType)
          : ''
      })
      return type
    }
    if (schema.enum) {
      return schema.enum.map((value) => `"${value}"`).join(' | ')
    }
    // 基本类型
    return TYPE_MAP[schema.type]
  }

  let ref = ''
  if (schema.type === 'array' && schema.items?.$ref) {
    ref = extractInterfaceNameByRef(schema.items.$ref)
  } else if (schema.$ref) {
    ref = extractInterfaceNameByRef(schema.$ref)
  }

  return {
    type: recursive(schema, false),
    formatType: recursive(schema),
    ref,
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
  extractInterfaceNameByRef,
  isRef,
  schemaToTsType,
  traverseTree,
  TYPE_MAP,
  SPECIAL_CHARACTERS_MAP_OPEN,
  SPECIAL_CHARACTERS_MAP_CLOSE,
}
