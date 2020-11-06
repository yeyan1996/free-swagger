import { OpenAPIV2 } from 'openapi-types'
import prettier from 'prettier/standalone'
import parserTypescript from 'prettier/parser-typescript'
import parserBabel from 'prettier/parser-babel'
import {
  buildInInterfaces,
  flatInterfaceName,
  formatGenericInterface,
} from './parse/interface'

export interface ConfigClient {
  source: OpenAPIV2.Document
  templateFunction?: TemplateFunction
  lang?: 'js' | 'ts'
  useJsDoc?: boolean
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

const SPECIAL_CHARACTERS_MAP_OPEN: { [key: string]: string } = {
  '«': '<',
  '[': '<',
  '{': '<',
  '<': '<',
}

const SPECIAL_CHARACTERS_MAP_CLOSE: { [key: string]: string } = {
  '»': '>',
  ']': '>',
  '}': '>',
  '>': '>',
}

// openApi 类型 => ts 类型
const TYPE_MAP: { [key: string]: string } = {
  boolean: 'boolean',
  bool: 'boolean',
  Boolean: 'boolean',
  long: 'number',
  Int64: 'number',
  integer: 'number',
  number: 'number',
  string: 'string',
  file: 'Blob',
  formData: 'FormData',
  Void: 'void',
  object: 'object',
  array: 'Array<any>',
}

const traverseTree = <T>(
  tree: T,
  cb: (node: T) => any,
  childrenKey = 'generics'
) => {
  cb(tree)
  // @ts-ignore
  if (tree[childrenKey]) {
    // @ts-ignore
    tree[childrenKey].forEach((child: T) => {
      traverseTree(child, cb, childrenKey)
    })
  }
}

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
        ...flatInterfaceName(originRef)
          // 排除 ts 内置类型
          .filter((item) => !Object.values(TYPE_MAP).includes(item))
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
      return schema.items.enum
        ? `(${recursive(schema.items)})[]`
        : `${recursive(schema.items)}[]`
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
  traverseTree,
  TYPE_MAP,
  SPECIAL_CHARACTERS_MAP_OPEN,
  SPECIAL_CHARACTERS_MAP_CLOSE,
}
