import {
  ClientConfig,
  formatCode,
  genJsDoc,
  genPath,
  Method,
  parsePath,
} from '../..'
import { OpenAPIV2 } from 'openapi-types'

const compilePath = (
  config: Required<ClientConfig>,
  url: string,
  method: Method
) => {
  // api 名字
  const name: OpenAPIV2.OperationObject['operationId'] =
    config.source.paths[url!][method!].operationId
  if (!name) return { code: '', jsDocCode: '' }

  const parsedApi = parsePath(
    name,
    `${config.source.basePath}${url}`,
    method,
    config.source.paths[url!][method!]
  )

  const code = formatCode(config.lang)(
    genPath(parsedApi, config.templateFunction, config.useJsDoc)
  )
  const jsDocCode = genJsDoc(parsedApi)

  // const interfaceCode = compileInterface(config.source)

  // todo 重构 compile 目录下，各个文件的函数的返回值
  return { code, jsDocCode, parsedApi }
}

export { compilePath }
