// 不要缩写，否则会找不到 map/genericInterfaceMap/recursiveMap
import { ParsedInterface, parseInterface } from '../parse/interface'
import { formatCode, traverseTree, TYPE_MAP } from '../utils'
import { genInterface } from '../gen/interface'
import { DEFAULT_HEAD_INTERFACE, DEFAULT_HEAD_JS_DOC_TYPES } from '../default'
import { genJsDocTypeDef } from '../..'
import { uniq } from 'lodash'
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
  Required<Pick<CompileTypesParams, 'source' | 'contextMap' | 'interfaceName'>>
> &
  Pick<CompileTypesParams, 'recursive' | 'type'> & { imports: string[] }

export type CompileTypes = (
  params: CompileTypesParams
) => { code: string; imports: string[] }
export type CompileType = (
  params: CompileTypeParams
) => { code: string; imports: string[] }

// 生成单个 interface 代码
const compileType: CompileType = ({
  source,
  interfaceName, // origin interface name
  contextMap,
  type = 'interface',
  recursive,
  imports,
}) => {
  if (!source.definitions![interfaceName]) {
    return { code: '', imports }
  }
  const res = parseInterface(source.definitions!, interfaceName, type)
  let code = ''
  try {
    traverseTree(res, (node) => {
      // 收集依赖
      if (node.props) {
        Object.values(node.props).forEach((value) => {
          imports.push(...value.imports)
        })
      }
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
              imports,
            }).code
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
    return { code: code ? `${code.trim()}\n` : code, imports: uniq(imports) }
  } catch (e) {
    console.warn(
      `${
        type === 'interface' ? 'interfaceName' : 'jsDoc'
      }: ${interfaceName} 生成失败，检查是否符合 swagger 规范`
    )
    console.warn(e)
    return {
      code: `// ${
        type === 'interface' ? 'interfaceName' : 'jsDoc'
      }: ${interfaceName} 生成失败，检查是否符合 swagger 规范
    
`,
      imports: uniq(imports),
    }
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
  // 收集依赖
  const imports: string[] = []
  if (!source.definitions) return { code: '', imports }
  // 单个 type
  if (interfaceName) {
    const map = contextMap ?? new Map<string, ParsedInterface>()
    return compileType({
      recursive,
      source,
      interfaceName,
      imports,
      type,
      contextMap: map,
    })
  } else {
    // 全量 type
    const contextMap = new Map<string, ParsedInterface>()
    const interfaceCode = Object.keys(source.definitions).reduce((acc, cur) => {
      const { code } = compileType({
        recursive,
        source,
        interfaceName: cur,
        contextMap,
        imports,
        type,
      })
      if (code) {
        return `${acc + code}\n`
      } else {
        return acc
      }
    }, '')
    const code =
      type === 'interface'
        ? formatCode('ts')(`${DEFAULT_HEAD_INTERFACE}\n${interfaceCode}`).trim()
        : `${DEFAULT_HEAD_JS_DOC_TYPES}\n${interfaceCode}`.trim()
    return { code, imports: uniq(imports) }
  }
}

export { compileTypes }
