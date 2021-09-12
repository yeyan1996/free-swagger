import { CoreConfig } from './src/utils'
import { Method } from './src/parse/path'

declare function freeSwaggerCore(
  config: CoreConfig,
  url?: string,
  method?: Method
): string

export default freeSwaggerCore

export * from './src/default/template'
export * from './src/default/index'
export * from './src/utils'
export * from './src/gen/path'
export * from './src/gen/jsDoc'
export * from './src/parse/path'
export * from './src/parse/interface'
export * from './src/compile/interface'
export * from './src/compile/jsDoc'
export * from './src/compile/path'
