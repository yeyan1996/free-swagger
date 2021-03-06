import { OpenAPIV2 } from 'openapi-types'
import { ServerConfig, MockConfig } from './src/utils'
import { ParsedPathsObject } from './src/parse/path'

declare function freeSwagger(
  config: ServerConfig | string
): Promise<OpenAPIV2.Document>

declare function mock(config: MockConfig | string): Promise<void>
declare function compile(
  config: Required<ServerConfig>,
  events?: {
    onChooseApi?: (params: {
      paths: ParsedPathsObject
    }) => Promise<ParsedPathsObject>
  }
): Promise<any>

export default freeSwagger
export * from './src/utils'
export * from './src/default'
export { ParsedPathsObject } from './src/parse/path'
export { mock }
export { compile }
