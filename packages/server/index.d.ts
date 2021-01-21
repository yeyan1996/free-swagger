import { OpenAPIV2 } from 'openapi-types'
import { ServerConfig, MockConfig } from './src/utils'

declare function freeSwagger(
  config: ServerConfig | string
): Promise<OpenAPIV2.Document>

declare function mock(config: MockConfig | string): Promise<void>
declare function compile(config: Required<ServerConfig>): Promise<any>

export default freeSwagger
export * from './src/utils'
export * from './src/default'
export { mock }
export { compile }
