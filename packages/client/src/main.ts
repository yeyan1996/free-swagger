import { Method } from './parse/path'
import { ClientConfig } from './utils'
import { mergeDefaultParams } from './default'
import { compileInterfaces } from './compile/interface'
import { compileJsDocTypeDefs } from './compile/jsDoc'
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
  } = compilePath(mergedConfig, url!, method!)
  return (
    (config.useJsDoc && config.lang === 'js' ? jsDocCode : '') +
    (config.useInterface && config.lang === 'ts'
      ? `${
          queryInterfaceCode + bodyInterfaceCode + pathInterfaceCode
        }\n${responseInterfaceCode}`
      : '') +
    code
  )
}

export default freeSwaggerClient
export { compileInterfaces, compileJsDocTypeDefs }
export * from './default/template'
export * from './utils'
export * from './gen/path'
export * from './gen/jsDoc'
export * from './parse/path'
export * from './parse/interface'
