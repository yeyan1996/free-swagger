import { ClientConfig } from './src/utils'

declare function freeSwaggerClient(
  config: ClientConfig,
  url?: string,
  method?: string
): string

export default freeSwaggerClient

export * from './src/default/template'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/gen/jsDoc'
export * from './src/parse/path'
export * from './src/parse/interface'
export * from './src/compile/interface'
export * from './src/compile/jsDoc'
export * from './src/compile/path'
