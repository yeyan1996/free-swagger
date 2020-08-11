import { genPath } from './gen/path'
import { Method, parsePath } from './parse/path'
import { OpenAPIV2 } from 'openapi-types'
import { ConfigClient } from './utils'
import { formatCode } from './utils'
import { mergeDefaultConfig } from './default'
import { compileInterfaces } from './compile/interface'
import { compileJsDocs } from './compile/jsDoc'
import { genJsDoc } from './gen/jsDoc'

const freeSwaggerClient = (
  config: ConfigClient,
  url?: string,
  method?: Method
): string => {
  const chooseAll = !url || !method
  if (chooseAll) return ''

  const mergedConfig = mergeDefaultConfig(config)

  // api 名字
  const name: OpenAPIV2.OperationObject['operationId'] =
    config.source.paths[url!][method!].operationId
  if (!name) return ''

  const api = parsePath(
    name,
    `${config.source.basePath}${url}`,
    method!,
    config.source.paths[url!][method!]
  )
  const code = genPath(
    api,
    mergedConfig.templateFunction,
    mergedConfig.useJsDoc
  )
  const jsDocCode =
    mergedConfig.useJsDoc && mergedConfig.lang === 'js' ? genJsDoc(api) : ''

  return formatCode(mergedConfig.lang)(jsDocCode + code)
}

export default freeSwaggerClient
export { compileInterfaces, compileJsDocs }
export * from './default/template'
export * from './utils'
export * from './gen/path'
export * from './parse/path'
export * from './parse/interface'
