import {
  ClientConfig,
  formatCode,
  genJsDoc,
  genPath,
  Method,
  parsePath,
} from '../..'
import { OpenAPIV2 } from 'openapi-types'
import { compileInterface } from './interface'
import { isString } from 'lodash'

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

  const code = formatCode(config.lang)(genPath(parsedApi, config))
  // TODO: 为啥用 gen 不用 compile?
  const jsDocCode = genJsDoc(parsedApi)

  const queryInterfaceName = isString(parsedApi.queryParamsInterface.type)
    ? parsedApi.queryParamsInterface.type
    : ''
  const bodyInterfaceName = isString(parsedApi.bodyParamsInterface.type)
    ? parsedApi.bodyParamsInterface.type
    : ''
  const pathInterfaceName = isString(parsedApi.pathParamsInterface.type)
    ? parsedApi.pathParamsInterface.type
    : ''
  const responseInterfaceName = isString(parsedApi.responseInterface.type)
    ? parsedApi.responseInterface.type
    : ''
  const contextMap = new Map()
  const queryInterfaceCode = definitions![queryInterfaceName]
    ? compileInterface({
        source: config.source,
        interfaceName: queryInterfaceName,
        contextMap,
      })
    : ''
  const bodyInterfaceCode = definitions![bodyInterfaceName]
    ? compileInterface({
        source: config.source,
        interfaceName: bodyInterfaceName,
        contextMap,
      })
    : ''
  const pathInterfaceCode = definitions![pathInterfaceName]
    ? compileInterface({
        source: config.source,
        interfaceName: pathInterfaceName,
        contextMap,
      })
    : ''
  const responseInterfaceCode = definitions![responseInterfaceName]
    ? compileInterface({
        source: config.source,
        interfaceName: responseInterfaceName,
        contextMap,
      })
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
