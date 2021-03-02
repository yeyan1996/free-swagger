import {
  ClientConfig,
  formatCode,
  genJsDoc,
  genPath,
  Method,
  parsePath,
} from '../..'
import { OpenAPIV2 } from 'openapi-types'
import { isString } from 'lodash'
import { compileJsDocTypeDefs } from './jsDoc'
import { compileInterfaces } from './interface'

const compilePath = (
  config: Required<ClientConfig>,
  url: string,
  method: Method
) => {
  const { source } = config
  const { definitions, paths, basePath } = source
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

  const code = genPath(parsedApi, config)
  const jsDocCode = genJsDoc(parsedApi) // js doc 和生成普通 code 的入参相同

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

  const contextMapInterface = new Map()
  const queryInterfaceCode = definitions![queryInterfaceName]
    ? compileInterfaces({
        source,
        interfaceName: queryInterfaceName,
        contextMap: contextMapInterface,
        recursive: config.recursive,
      })
    : ''
  const bodyInterfaceCode = definitions![bodyInterfaceName]
    ? compileInterfaces({
        source,
        interfaceName: bodyInterfaceName,
        contextMap: contextMapInterface,
        recursive: config.recursive,
      })
    : ''
  const pathInterfaceCode = definitions![pathInterfaceName]
    ? compileInterfaces({
        source,
        interfaceName: pathInterfaceName,
        contextMap: contextMapInterface,
        recursive: config.recursive,
      })
    : ''
  const responseInterfaceCode = definitions![responseInterfaceName]
    ? compileInterfaces({
        source,
        interfaceName: responseInterfaceName,
        contextMap: contextMapInterface,
        recursive: config.recursive,
      })
    : ''

  const contextMapJsDoc = new Map()
  const queryJsDocCode = definitions![queryInterfaceName]
    ? compileJsDocTypeDefs({
        source,
        interfaceName: queryInterfaceName,
        contextMap: contextMapJsDoc,
        recursive: config.recursive,
      })
    : ''
  const bodyJsDocCode = definitions![bodyInterfaceName]
    ? compileJsDocTypeDefs({
        source,
        interfaceName: bodyInterfaceName,
        contextMap: contextMapJsDoc,
        recursive: config.recursive,
      })
    : ''
  const pathJsDocCode = definitions![pathInterfaceName]
    ? compileJsDocTypeDefs({
        source,
        interfaceName: pathInterfaceName,
        contextMap: contextMapJsDoc,
        recursive: config.recursive,
      })
    : ''

  // todo 重构 compile 目录下，各个文件的函数的返回值
  return {
    code: formatCode(config.lang)(code),
    jsDocCode,
    parsedApi,
    queryInterfaceCode,
    bodyInterfaceCode,
    pathInterfaceCode,
    responseInterfaceCode,
    queryJsDocCode,
    bodyJsDocCode,
    pathJsDocCode,
  }
}

export { compilePath }
