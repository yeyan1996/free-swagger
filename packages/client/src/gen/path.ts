import {
  ParsedSchemaObject,
  ParsedSchema,
  ClientConfig,
  TemplateFunction,
} from '../utils'
import { isEmpty } from 'lodash'
import { ParsedApi } from '../..'

// 只要有一个属性值不是对象就断言当前对象类型为 ParsedSchemaObject
const isParsedSchemaObject = (
  paramsInterface: ParsedSchema
): paramsInterface is ParsedSchemaObject =>
  Object.keys(paramsInterface).some(
    // @ts-ignore
    (key) => typeof paramsInterface[key] !== 'object'
  )

const genParsedSchema = (paramsInterface?: ParsedSchema): string => {
  if (!paramsInterface || isEmpty(paramsInterface)) return ''

  if (isParsedSchemaObject(paramsInterface)) {
    return paramsInterface.formatType
  } else {
    return `{
    ${Object.entries(paramsInterface)
      .map(
        ([propName, prop]) =>
          `
          "${propName}"${prop.required ? '' : '?'}: ${prop.formatType}`
      )
      .join(',')}
      }`
  }
}

const genIParams = ({
  pathParamsInterface,
  queryParamsInterface,
  bodyParamsInterface,
}: ParsedApi): {
  IPathParams: string
  IQueryParams: string
  IBodyParams: string
} => ({
  IQueryParams: genParsedSchema(queryParamsInterface),
  IBodyParams: genParsedSchema(bodyParamsInterface),
  IPathParams: genParsedSchema(pathParamsInterface),
})

const genPath = (
  api: ParsedApi,
  config: Pick<Required<ClientConfig>, 'templateFunction' | 'useJsDoc' | 'lang'>
): string => {
  const { IPathParams, IBodyParams, IQueryParams } = genIParams(api)
  return config.templateFunction({
    name: api.name,
    method: api.method,
    url: api.url,
    responseType: api.responseInterface.isBinary ? 'blob' : 'json',
    deprecated: api.deprecated,
    summary: config.useJsDoc && config.lang === 'js' ? '' : api.summary,
    IResponse: api.responseInterface.formatType,
    pathParams: Object.keys(api.pathParamsInterface),
    IQueryParams,
    IBodyParams,
    IPathParams,
  })
}

export { genPath, isParsedSchemaObject, genIParams }
