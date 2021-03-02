import { ClientConfig } from './src/utils'
import { CompileTypesParams } from './src/compile/type'

declare function freeSwaggerClient(
  config: ClientConfig,
  url?: string,
  method?: string
): string
declare function compileInterfaces(params: CompileTypesParams): string
declare function compileJsDocTypeDefs(params: CompileTypesParams): string

export default freeSwaggerClient

export { compileInterfaces, compileJsDocTypeDefs }
export * from './src/default/template'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/gen/jsDoc'
export * from './src/parse/path'
export * from './src/parse/interface'
