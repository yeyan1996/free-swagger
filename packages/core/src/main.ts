import { Method } from './parse/path'
import { ClientConfig } from './utils'
import { mergeDefaultParams } from './default'
import { compilePath } from './compile/path'

const freeSwaggerClient = (
  config: ClientConfig,
  url?: string,
  method?: Method
): string => {
  const chooseAll = !url || !method
  if (chooseAll) return ''
  const mergedConfig = mergeDefaultParams(config)
  const {
    jsDocCode,
    code,
    queryInterfaceCode,
    bodyInterfaceCode,
    pathInterfaceCode,
    responseInterfaceCode,
    queryJsDocCode,
    bodyJsDocCode,
    pathJsDocCode,
  } = compilePath(mergedConfig, url!, method!)

  if (config.typedef && config.lang === 'js') {
    return [queryJsDocCode, bodyJsDocCode, pathJsDocCode]
      .filter(Boolean)
      .join(`\n`)
  }

  if (config.interface && config.lang === 'ts') {
    return [
      queryInterfaceCode,
      bodyInterfaceCode,
      pathInterfaceCode,
      responseInterfaceCode,
    ]
      .filter(Boolean)
      .join(`\n`)
  }

  if (config.jsDoc && config.lang === 'js') {
    return jsDocCode + code
  }

  return code
}

export default freeSwaggerClient
export * from './default/template'
export * from './default/index'
export * from './utils'
export * from './gen/path'
export * from './gen/jsDoc'
export * from './parse/path'
export * from './parse/interface'
export * from './compile/interface'
export * from './compile/jsDoc'
export * from './compile/path'
