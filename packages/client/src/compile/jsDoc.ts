import { OpenAPIV2 } from 'openapi-types'
// 不要缩写，否则会找不到 map/genericInterfaceMap/recursiveMap
import { parseInterface, ParsedInterface } from '../parse/interface'
import { genJsDocTypeDef, traverseTree } from '../..'
import { DEFAULT_HEAD_JS_DOC_TYPES } from '../default'

const compileJsDocTypeDef = (
  source: OpenAPIV2.Document,
  interfaceName: string,
  contextMap?: Map<string, ParsedInterface>
): string => {
  const res = parseInterface(source.definitions!, interfaceName)
  let code = ''
  try {
    traverseTree(res!, (node) => {
      if (contextMap) {
        if (contextMap.has(node.name)) {
          return
        } else {
          contextMap.set(node.name, node)
        }
      }
      code += `${genJsDocTypeDef(node)}\n`
    })
    return code
  } catch (e) {
    console.warn(`jsDoc: ${interfaceName} 生成失败，检查是否符合 swagger 规范`)
    console.warn(e)
    return `
    // jsDoc: ${interfaceName} 生成失败，检查是否符合 swagger 规范
    `
  }
}

// 生成全量 jsDoc type 代码
const compileJsDocTypeDefs = (
  source: OpenAPIV2.Document,
  interfaceName?: string
): string => {
  if (!source.definitions) return ''

  if (interfaceName) {
    return compileJsDocTypeDef(source, interfaceName)
  } else {
    const contextMap = new Map<string, ParsedInterface>()

    const interfaceCode = Object.keys(source.definitions).reduce((acc, cur) => {
      return acc + compileJsDocTypeDef(source, cur, contextMap)
    }, '')

    return DEFAULT_HEAD_JS_DOC_TYPES + interfaceCode
  }
}

export { compileJsDocTypeDefs, compileJsDocTypeDef }
