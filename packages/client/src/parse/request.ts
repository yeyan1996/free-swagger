import { OpenAPIV2 } from 'openapi-types'
import { isRef, schemaToTsType, TYPE_MAP } from '../utils'
import { ParsedSchemaObject, ParsedSchema } from '../utils'

export interface Request {
  pathParamsInterface: ParsedSchema
  queryParamsInterface: ParsedSchema
  bodyParamsInterface: ParsedSchema
  imports: string[]
}

const parseParameter = (
  parameter: OpenAPIV2.Parameter,
  parametersImports: string[]
): ParsedSchemaObject => {
  const imports: string[] = []
  let formatType = ''
  let isBinary = false
  // 引用类型
  if (parameter.schema || parameter.items) {
    const parsedSchemaObject = schemaToTsType(
      parameter.schema || parameter.items
    )
    formatType = parsedSchemaObject.formatType
    isBinary = !!parsedSchemaObject.isBinary
    imports.push(...parsedSchemaObject.imports)
    parametersImports.push(...parsedSchemaObject.imports)
  } else {
    formatType = TYPE_MAP[parameter.type] // 基本类型
  }
  return {
    type: parameter.type,
    formatType,
    imports,
    isBinary,
    description: parameter.description || '',
    required: parameter.required || false,
  }
}

const getRequestType = (paramsSchema?: OpenAPIV2.Parameters): Request => {
  if (!paramsSchema || paramsSchema.some(isRef))
    return {
      imports: [],
      pathParamsInterface: {},
      queryParamsInterface: {},
      bodyParamsInterface: {},
    }

  const pathParamsInterface: { [key: string]: ParsedSchemaObject } = {}
  const queryParamsInterface: { [key: string]: ParsedSchemaObject } = {}
  let bodyParamsInterface: ParsedSchemaObject = <ParsedSchemaObject>{}
  const imports: string[] = []
  ;(paramsSchema as OpenAPIV2.Parameter[]).forEach((parameter) => {
    // 引用类型定义
    switch (parameter.in) {
      case 'path':
        pathParamsInterface[parameter.name] = parseParameter(parameter, imports)
        break
      case 'query':
        queryParamsInterface[parameter.name] = parseParameter(
          parameter,
          imports
        )
        break
      case 'formData':
        bodyParamsInterface = {
          type: parameter.type,
          formatType: 'FormData',
          imports: [],
          isBinary: true,
          description: '',
          required: true,
        }
        break
      case 'body':
        bodyParamsInterface = parseParameter(parameter, imports)
        break
      default:
        return
    }
  })
  return {
    imports,
    pathParamsInterface,
    bodyParamsInterface,
    queryParamsInterface,
  }
}

export { getRequestType }
