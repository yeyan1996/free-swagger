import { OpenAPIV2 } from 'openapi-types'
import { getResponseType, Response } from './response'
import { getRequestType, Request } from './request'
import { uniq } from 'lodash'

export interface Api extends Request, Response {
  deprecated: boolean
  summary: string
  url: string
  method: string
  name: string
}
export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'del'
  | 'head'
  | 'options'
  | 'patch'
  | 'delete'

const parsePath = (
  name: string,
  url: string,
  method: Method,
  {
    parameters,
    summary = '',
    responses,
    deprecated = false,
  }: OpenAPIV2.OperationObject
): Api => {
  // 获取到接口的参数
  const {
    bodyParamsInterface,
    queryParamsInterface,
    pathParamsInterface,
    imports: requestImports,
  } = getRequestType(parameters)

  const { responseInterface } = getResponseType(responses)

  return {
    imports: uniq([...requestImports, ...responseInterface.imports]),
    summary,
    deprecated,
    url,
    name,
    method,
    bodyParamsInterface,
    queryParamsInterface,
    pathParamsInterface,
    responseInterface,
  }
}

export { parsePath }
