import { OpenAPIV2 } from 'openapi-types'
// 不要缩写，否则会找不到 map/genericInterfaceMap/recursiveMap
import { ParsedInterface, parseInterface } from '../parse/interface'
import { formatCode, traverseTree, TYPE_MAP } from '../utils'
import { genInterface } from '../gen/interface'
import { DEFAULT_HEAD_INTERFACE, DEFAULT_HEAD_JS_DOC_TYPES } from '../default'
import { genJsDocTypeDef } from '../..'

export type CompileType = 'jsDoc' | 'interface'

// 生成单个 interface 代码
const compileInterface = ({
  source,
  interfaceName, // origin interface name
  contextMap,
  compileType = 'interface',
}: {
  source: OpenAPIV2.Document
  interfaceName: string
  contextMap: Map<string, ParsedInterface>
  compileType?: CompileType
}): string => {
  if (!source.definitions![interfaceName]) {
    return ''
  }
  const res = parseInterface(source.definitions!, interfaceName, compileType)
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
          compileType === 'interface'
            ? `${formatCode('ts')(genInterface(node))}\n`
            : `${genJsDocTypeDef(node)}\n`
        return
      }
      if (TYPE_MAP[node.name] || !node.props) {
        return
      }
      // 复制代码块的 interface 时，递归生成依赖的所有 interface
      code += Object.values(node.props)
        .filter((prop) => prop.ref)
        .reduce(
          (acc, prop) =>
            `${
              acc +
              compileInterface({
                source,
                interfaceName: prop.ref,
                contextMap,
                compileType,
              })
            }`,
          ''
        )
      code +=
        compileType === 'interface'
          ? `${formatCode('ts')(genInterface(node))}\n`
          : `${genJsDocTypeDef(node)}\n`
    })
    return code
  } catch (e) {
    console.warn(
      `${
        compileType === 'interface' ? 'interfaceName' : 'jsDoc'
      }: ${interfaceName} 生成失败，检查是否符合 swagger 规范`
    )
    console.warn(e)
    return `// ${
      compileType === 'interface' ? 'interfaceName' : 'jsDoc'
    }: ${interfaceName} 生成失败，检查是否符合 swagger 规范
    
`
  }
}

// 生成全量 interface/jsDoc 代码
const compileInterfaces = ({
  source,
  interfaceName,
  compileType = 'interface',
}: {
  source: OpenAPIV2.Document
  interfaceName?: string
  compileType?: CompileType
}): string => {
  if (!source.definitions) return ''
  if (interfaceName) {
    const contextMap: Map<string, ParsedInterface> = new Map()
    return compileInterface({ source, interfaceName, compileType, contextMap })
  } else {
    const contextMap = new Map<string, ParsedInterface>()
    const interfaceCode = Object.keys(source.definitions).reduce((acc, cur) => {
      return (
        acc +
        compileInterface({
          source,
          interfaceName: cur,
          contextMap,
          compileType,
        })
      )
    }, '')

    return compileType === 'interface'
      ? formatCode('ts')(`${DEFAULT_HEAD_INTERFACE}\n${interfaceCode}`).trim()
      : `${DEFAULT_HEAD_JS_DOC_TYPES}\n${interfaceCode}`.trim()
  }
}

export { compileInterface, compileInterfaces }
