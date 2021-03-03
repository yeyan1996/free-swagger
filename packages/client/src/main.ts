import { Method } from './parse/path'
import { ClientConfig } from './utils'
import { mergeDefaultParams } from './default'
import { compileInterfaces } from './compile/interface'
import { compileJsDocTypedefs } from './compile/jsDoc'
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

  const useJsDoc = config.jsDoc && config.lang === 'js'
  const useInterface = config.interface && config.lang === 'ts'

  if (useJsDoc) {
    if (config.typedef) {
      return (
        [queryJsDocCode, bodyJsDocCode, pathJsDocCode]
          .filter(Boolean)
          .join(`\n`) + ['\n', jsDocCode, code].join('')
      )
    } else {
      return [jsDocCode, code].join('')
    }
  }
  if (useInterface) {
    if (config.interface) {
      return [
        queryInterfaceCode,
        bodyInterfaceCode,
        pathInterfaceCode,
        responseInterfaceCode,
        code,
      ]
        .filter(Boolean)
        .join(`\n`)
    } else {
      return code
    }
  }
  return code
}

export default freeSwaggerClient
export { compileInterfaces, compileJsDocTypedefs }
export * from './default/template'
export * from './utils'
export * from './gen/path'
export * from './gen/jsDoc'
export * from './parse/path'
export * from './parse/interface'
