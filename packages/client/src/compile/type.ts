// 不要缩写，否则会找不到 map/genericInterfaceMap/recursiveMap
import { ParsedInterface, parseInterface } from '../parse/interface'
import { formatCode, traverseTree, TYPE_MAP } from '../utils'
import { genInterface } from '../gen/interface'
import { DEFAULT_HEAD_INTERFACE, DEFAULT_HEAD_JS_DOC_TYPES } from '../default'
import { genJsDocTypeDef } from '../..'
import { OpenAPIV2 } from 'openapi-types'

export type Type = 'jsDoc' | 'interface'
export type CompileTypesParams = {
  source: OpenAPIV2.Document
  contextMap?: Map<string, ParsedInterface>
  interfaceName?: string
  type?: Type
  recursive?: boolean
}
export type CompileTypeParams = Required<
  Pick<CompileTypesParams, 'source' | 'contextMap' | 'interfaceName'>
> &
  Pick<CompileTypesParams, 'recursive' | 'type'>

export type CompileTypes = (params: CompileTypesParams) => string
export type CompileType = (params: CompileTypeParams) => string

// 生成单个 interface 代码
const compileType: CompileType = ({
  source,
  interfaceName, // origin interface name
  contextMap,
  type = 'interface',
  recursive,
}) => {
  if (!source.definitions![interfaceName]) {
    return ''
  }
  const res = parseInterface(source.definitions!, interfaceName, type)
  let code = ''
  try {
    traverseTree(res, (node) => {
      if (contextMap.has(node.name)) {
        return
      } else {
        contextMap.set(node.name, node)
      }
      if (node.code) {
        code +=
          type === 'interface'
            ? `${formatCode('ts')(genInterface(node))}\n`
            : `${genJsDocTypeDef(node)}\n`
        return
      }
      if (TYPE_MAP[node.name] || !node.props) {
        return
      }
      // 复制代码块的 interface 时，递归生成依赖的所有 interface
      if (recursive) {
        code += Object.values(node.props)
          .filter((prop) => prop.ref)
          .reduce((acc, prop) => {
            const recursiveCode = compileType({
              source,
              interfaceName: prop.ref,
              contextMap,
              type,
              recursive,
            })
            if (recursiveCode) {
              return `${acc + recursiveCode}\n`
            } else {
              return acc
            }
          }, '')
      }
      code +=
        type === 'interface'
          ? `${formatCode('ts')(genInterface(node))}\n`
          : `${genJsDocTypeDef(node)}\n`
    })
    return code ? `${code.trim()}\n` : code
  } catch (e) {
    console.warn(
      `${
        type === 'interface' ? 'interfaceName' : 'jsDoc'
      }: ${interfaceName} 生成失败，检查是否符合 swagger 规范`
    )
    console.warn(e)
    return `// ${
      type === 'interface' ? 'interfaceName' : 'jsDoc'
    }: ${interfaceName} 生成失败，检查是否符合 swagger 规范
    
`
  }
}

// 生成全量 interface/jsDoc 代码
const compileTypes: CompileTypes = ({
  source,
  interfaceName,
  type = 'interface',
  contextMap,
  recursive,
}) => {
  if (!source.definitions) return ''
  if (interfaceName) {
    const map = contextMap ?? new Map<string, ParsedInterface>()
    return compileType({
      recursive,
      source,
      interfaceName,
      type,
      contextMap: map,
    })
  } else {
    const contextMap = new Map<string, ParsedInterface>()
    const interfaceCode = Object.keys(source.definitions).reduce((acc, cur) => {
      const typeCode = compileType({
        recursive,
        source,
        interfaceName: cur,
        contextMap,
        type,
      })
      if (typeCode) {
        return `${acc + typeCode}\n`
      } else {
        return acc
      }
    }, '')
    return type === 'interface'
      ? formatCode('ts')(`${DEFAULT_HEAD_INTERFACE}\n${interfaceCode}`).trim()
      : `${DEFAULT_HEAD_JS_DOC_TYPES}\n${interfaceCode}`.trim()
  }
}

export { compileTypes }
