import { ClientConfig } from './src/utils'
import { OpenAPIV2 } from 'openapi-types'

declare function freeSwaggerClient(
  config: ClientConfig,
  url?: string,
  method?: string
): string

declare function compileInterfaces(
  source: OpenAPIV2.Document,
  interfaceName?: string
): string

declare function compileJsDocs(
  source: OpenAPIV2.Document,
  interfaceName?: string
): string

export default freeSwaggerClient
export { compileInterfaces, compileJsDocs }
export * from './src/default/template'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/gen/jsDoc'
export * from './src/parse/path'
export * from './src/parse/interface'
