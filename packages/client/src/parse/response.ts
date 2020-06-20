import { OpenAPIV2 } from 'openapi-types'
import { ParsedSchemaObject, schemaToTsType } from '../utils'
const SUCCESS_CODE = 200

export interface Response {
  // todo 可能是多个属性字段
  responseInterface: ParsedSchemaObject
}

const getResponseType = (responses: {
  [responseCode: string]: OpenAPIV2.ResponseObject
}): Response => {
  if (!responses[SUCCESS_CODE]) {
    return {
      responseInterface: {
        type: '',
        imports: [],
        required: false,
        description: '',
        isBinary: false,
      },
    }
  }
  const { schema } = responses[SUCCESS_CODE]

  return {
    responseInterface: schemaToTsType(schema),
  }
}

export { getResponseType }
