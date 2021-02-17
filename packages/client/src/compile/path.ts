import {
  ClientConfig,
  formatCode,
  genIParams,
  genJsDoc,
  genPath,
  Method,
  parsePath,
} from '../..'
import { OpenAPIV2 } from 'openapi-types'
import { compileInterface } from './interface'

const compilePath = (
  config: Required<ClientConfig>,
  url: string,
  method: Method
) => {
  const { definitions, paths, basePath } = config.source
  // api 名字
  const name: OpenAPIV2.OperationObject['operationId'] =
    paths[url][method].operationId
  if (!name) {
    throw new Error(`can not find name ${name}`)
  }

  const parsedApi = parsePath(
    name,
    `${basePath}${url}`,
    method,
    paths[url][method]
  )

  const code = formatCode(config.lang)(
    genPath(parsedApi, config.templateFunction, config.useJsDoc)
  )

  const jsDocCode = genJsDoc(parsedApi)

  const { IQueryParams, IBodyParams, IPathParams } = genIParams(parsedApi)

  const queryInterfaceCode = definitions![IQueryParams]
    ? compileInterface(config.source, IQueryParams)
    : ''
  const bodyInterfaceCode = definitions![IBodyParams]
    ? compileInterface(config.source, IBodyParams)
    : ''
  const pathInterfaceCode = definitions![IPathParams]
    ? compileInterface(config.source, IPathParams)
    : ''

  const responseType =
    typeof parsedApi.responseInterface.type === 'string'
      ? parsedApi.responseInterface.type
      : ''
  const responseInterfaceCode = definitions![responseType]
    ? compileInterface(config.source, responseType)
    : ''

  // todo 重构 compile 目录下，各个文件的函数的返回值
  return {
    code,
    jsDocCode,
    parsedApi,
    queryInterfaceCode,
    bodyInterfaceCode,
    pathInterfaceCode,
    responseInterfaceCode,
  }
}

export { compilePath }
