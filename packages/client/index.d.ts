import { ClientConfig } from './src/utils'
import { OpenAPIV2 } from 'openapi-types'
import { CompileType } from './src/compile/interface'

declare function freeSwaggerClient(
  config: ClientConfig,
  url?: string,
  method?: string
): string

declare function compileInterfaces({
  source,
  interfaceName,
  compileType,
}: {
  source: OpenAPIV2.Document
  interfaceName?: string
  compileType?: CompileType
}): string

declare function compileJsDocTypeDefs({
  source,
  interfaceName,
  compileType,
}: {
  source: OpenAPIV2.Document
  interfaceName?: string
  compileType?: CompileType
}): string

export default freeSwaggerClient
export { compileInterfaces, compileJsDocTypeDefs }
export * from './src/default/template'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/gen/jsDoc'
export * from './src/parse/path'
export * from './src/parse/interface'
