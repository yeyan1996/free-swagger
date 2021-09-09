import {
  ClientConfig,
  formatCode,
  genJsDoc,
  genPath,
  Method,
  parsePath,
} from '../..'
import { OpenAPIV2 } from 'openapi-types'
import { isString, uniq } from 'lodash'
import { compileJsDocTypedefs } from './jsDoc'
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
  const imports: string[] = []

  const collectImports = (interfaceName: string) => {
    if (definitions![interfaceName]) {
      const { code, imports: interfaceImports } = compileInterfaces({
        source,
        url,
        interfaceName: interfaceName,
        contextMap: contextMapInterface,
        recursive: config.recursive,
      })
      imports.push(...interfaceImports)
      return code
    } else {
      return ''
    }
  }

  const queryInterfaceCode = collectImports(queryInterfaceName)
  const pathInterfaceCode = collectImports(pathInterfaceName)
  const bodyInterfaceCode = collectImports(bodyInterfaceName)
  const responseInterfaceCode = collectImports(responseInterfaceName)

  const contextMapJsDoc = new Map()
  const queryJsDocCode = definitions![queryInterfaceName]
    ? compileJsDocTypedefs({
        source,
        interfaceName: queryInterfaceName,
        contextMap: contextMapJsDoc,
        recursive: config.recursive,
      }).code
    : ''
  const bodyJsDocCode = definitions![bodyInterfaceName]
    ? compileJsDocTypedefs({
        source,
        interfaceName: bodyInterfaceName,
        contextMap: contextMapJsDoc,
        recursive: config.recursive,
      }).code
    : ''
  const pathJsDocCode = definitions![pathInterfaceName]
    ? compileJsDocTypedefs({
        source,
        interfaceName: pathInterfaceName,
        contextMap: contextMapJsDoc,
        recursive: config.recursive,
      }).code
    : ''

  return {
    code: formatCode(config.lang)(code),
    imports: uniq(imports),
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
