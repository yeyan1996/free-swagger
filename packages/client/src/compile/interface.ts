import { OpenAPIV2 } from 'openapi-types'
// 不要缩写，否则会找不到 map/genericInterfaceMap/recursiveMap
import { ParsedInterface, parseInterface } from '../parse/interface'
import { formatCode, traverseTree, TYPE_MAP } from '../utils'
import { genInterface } from '../gen/interface'
import { DEFAULT_HEAD_INTERFACE } from '../default'

// 生成单个 interface 代码
const compileInterface = (
  source: OpenAPIV2.Document,
  interfaceName: string,
  contextMap?: Map<string, ParsedInterface>
): string => {
  if (!source.definitions![interfaceName]) {
    return ''
  }
  const res = parseInterface(source.definitions!, interfaceName)
  let code = ''
  try {
    traverseTree(res!, (node) => {
      if (TYPE_MAP[node.name]) {
        return
      }
      if (contextMap) {
        if (contextMap.has(node.name)) {
          return
        } else {
          contextMap.set(node.name, node)
        }
      }
      code += `${formatCode('ts')(genInterface(node))}\n`
    })
    return code
  } catch (e) {
    console.warn(
      `interfaceName: ${interfaceName} 生成失败，检查是否符合 swagger 规范`
    )
    console.warn(e)
    return `// interfaceName: ${interfaceName} 生成失败，检查是否符合 swagger 规范
    
`
  }
}

// 生成全量 interface 代码
const compileInterfaces = (
  source: OpenAPIV2.Document,
  interfaceName?: string
): string => {
  if (!source.definitions) return ''
  if (interfaceName) {
    return compileInterface(source, interfaceName)
  } else {
    const contextMap = new Map<string, ParsedInterface>()
    const interfaceCode = Object.keys(source.definitions).reduce((acc, cur) => {
      return acc + compileInterface(source, cur, contextMap)
    }, '')

    return formatCode('ts')(`${DEFAULT_HEAD_INTERFACE}\n${interfaceCode}`)
  }
}

export { compileInterface, compileInterfaces }
