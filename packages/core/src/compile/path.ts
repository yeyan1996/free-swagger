import {
  CoreConfig,
  formatCode,
  genJsDoc,
  genPath,
  Method,
  parsePath,
} from '../..'
import { isString, uniq, capitalize, last } from 'lodash'
import { compileJsDocTypedefs } from './jsDoc'
import { compileInterfaces } from './interface'
import camelcase from 'camelcase'

export const createDefaultApiName = (url: string, method: Method): string => {
  return `${camelcase(last(url.split('/')) ?? '')}By${capitalize(method)}`
}

const compilePath = async (
  config: Required<CoreConfig>,
  url: string,
  method: Method
) => {
  const { source } = config
  const { definitions, paths, basePath } = source

  const operationObject = paths[url][method]
  if (!operationObject) {
    throw new Error('未找到目标')
  }
  // 接口函数名
  const name: string =
    operationObject.operationId ?? createDefaultApiName(url, method)

  const parsedApi = parsePath(
    name,
    `${basePath}${url}`,
    method,
    paths[url][method]
  )

  const code = genPath(parsedApi, config)
  const jsDocCode = genJsDoc(parsedApi) // js doc 和生成普通 code 的入参相同

  const queryInterfaceName = isString(parsedApi.queryParamsInterface.ref)
    ? parsedApi.queryParamsInterface.ref
    : ''
  const bodyInterfaceName = isString(parsedApi.bodyParamsInterface.ref)
    ? parsedApi.bodyParamsInterface.ref
    : ''
  const pathInterfaceName = isString(parsedApi.pathParamsInterface.ref)
    ? parsedApi.pathParamsInterface.ref
    : ''
  const responseInterfaceName = isString(parsedApi.responseInterface.ref)
    ? parsedApi.responseInterface.ref
    : ''

  const contextMapInterface = new Map()
  const imports: string[] = []

  const collectImports = async (interfaceName: string) => {
    if (definitions![interfaceName]) {
      const { code, imports: interfaceImports } = await compileInterfaces({
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

  const queryInterfaceCode = await collectImports(queryInterfaceName)
  const pathInterfaceCode = await collectImports(pathInterfaceName)
  const bodyInterfaceCode = await collectImports(bodyInterfaceName)
  const responseInterfaceCode = await collectImports(responseInterfaceName)

  const contextMapJsDoc = new Map()
  const queryJsDocCode = definitions![queryInterfaceName]
    ? (
        await compileJsDocTypedefs({
          source,
          interfaceName: queryInterfaceName,
          contextMap: contextMapJsDoc,
          recursive: config.recursive,
        })
      ).code
    : ''
  const bodyJsDocCode = definitions![bodyInterfaceName]
    ? (
        await compileJsDocTypedefs({
          source,
          interfaceName: bodyInterfaceName,
          contextMap: contextMapJsDoc,
          recursive: config.recursive,
        })
      ).code
    : ''
  const pathJsDocCode = definitions![pathInterfaceName]
    ? (
        await compileJsDocTypedefs({
          source,
          interfaceName: pathInterfaceName,
          contextMap: contextMapJsDoc,
          recursive: config.recursive,
        })
      ).code
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
