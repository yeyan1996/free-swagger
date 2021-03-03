import { ClientConfig } from './src/utils'
import { CompileTypesParams } from './src/compile/type'

declare function freeSwaggerClient(
  config: ClientConfig,
  url?: string,
  method?: string
): string
declare function compileInterfaces(
  params: CompileTypesParams
): { code: string; imports: string[] }
declare function compileJsDocTypedefs(
  params: CompileTypesParams
): { code: string; imports: string[] }

export default freeSwaggerClient

export { compileInterfaces, compileJsDocTypedefs }
export * from './src/default/template'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/gen/jsDoc'
export * from './src/parse/path'
export * from './src/parse/interface'
