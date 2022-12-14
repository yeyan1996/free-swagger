import { Method } from './parse/path'
import { CoreConfig } from './utils'
import { mergeDefaultParams } from './default'
import { compilePath } from './compile/path'

const freeSwaggerCore = async (
  config: CoreConfig,
  url?: string,
  method?: Method
): Promise<string> => {
  const chooseAll = !url || !method
  if (chooseAll) return ''
  const mergedConfig = await mergeDefaultParams(config)
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
  } = await compilePath(mergedConfig, url!, method!)

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

export default freeSwaggerCore
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
