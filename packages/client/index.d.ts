import { ConfigClient } from './src/utils'
import { OpenAPIV2 } from 'openapi-types'

declare function freeSwaggerClient(
  config: ConfigClient,
  url?: string,
  method?: string
): string

declare function compileInterfaces(
  source: OpenAPIV2.Document,
  interfaceName?: string
): string

export default freeSwaggerClient
export { compileInterfaces }
export * from './src/default/template'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/parse/path'
