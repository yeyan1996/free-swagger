import { OpenAPIV2 } from 'openapi-types'
import { isRef, schemaToTsType, TYPE_MAP } from '../utils'
import { ParsedSchemaObject, ParsedSchema } from '../utils'

export interface Request {
  pathParamsInterface: ParsedSchema
  queryParamsInterface: ParsedSchema
  bodyParamsInterface: ParsedSchema
}

const parseParameter = (parameter: OpenAPIV2.Parameter): ParsedSchemaObject => {
  let type = parameter.type
  let formatType = ''
  let isBinary = false
  let ref = ''
  // 引用类型
  if (parameter.schema || parameter.items) {
    const parsedSchemaObject = schemaToTsType(
      parameter.schema || parameter.items
    )
    type = parsedSchemaObject.type
    ref = parsedSchemaObject.ref
    formatType = parsedSchemaObject.formatType
    isBinary = !!parsedSchemaObject.isBinary
  } else {
    formatType = TYPE_MAP[parameter.type] // 基本类型
  }
  return {
    type,
    ref,
    formatType,
    isBinary,
    description: parameter.description || '',
    required: parameter.required || false,
  }
}

const getRequestType = (paramsSchema?: OpenAPIV2.Parameters): Request => {
  if (!paramsSchema || paramsSchema.some(isRef))
    return {
      pathParamsInterface: {},
      queryParamsInterface: {},
      bodyParamsInterface: {},
    }

  const pathParamsInterface: Record<string, ParsedSchemaObject> = {}
  const queryParamsInterface: Record<string, ParsedSchemaObject> = {}
  let bodyParamsInterface: ParsedSchemaObject = <ParsedSchemaObject>{}

  ;(paramsSchema as OpenAPIV2.Parameter[]).forEach((parameter) => {
    // 引用类型定义
    switch (parameter.in) {
      case 'path':
        pathParamsInterface[parameter.name] = parseParameter(parameter)
        break
      case 'query':
        queryParamsInterface[parameter.name] = parseParameter(parameter)
        break
      case 'formData':
        bodyParamsInterface = {
          type: parameter.type,
          formatType: 'FormData',
          ref: '',
          isBinary: true,
          description: '',
          required: true,
        }
        break
      case 'body':
        bodyParamsInterface = parseParameter(parameter)
        break
      default:
        return
    }
  })
  return {
    pathParamsInterface,
    bodyParamsInterface,
    queryParamsInterface,
  }
}

export { getRequestType }
