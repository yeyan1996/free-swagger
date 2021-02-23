import { OpenAPIV2 } from 'openapi-types'
import { ParsedInterface } from '../parse/interface'
import { compileInterface, compileInterfaces } from './interface'

const compileJsDocTypeDef = ({
  source,
  interfaceName,
  contextMap,
}: {
  source: OpenAPIV2.Document
  interfaceName: string
  contextMap: Map<string, ParsedInterface>
}): string =>
  compileInterface({
    source,
    interfaceName,
    contextMap,
    compileType: 'jsDoc',
  })

// 生成全量 jsDoc type 代码
const compileJsDocTypeDefs = ({
  source,
  interfaceName,
}: {
  source: OpenAPIV2.Document
  interfaceName?: string
}): string =>
  compileInterfaces({
    source,
    interfaceName,
    compileType: 'jsDoc',
  })

export { compileJsDocTypeDefs, compileJsDocTypeDef }
