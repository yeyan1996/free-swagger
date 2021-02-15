import { OpenAPIV2 } from 'openapi-types'
// 不要缩写，否则会找不到 map/genericInterfaceMap/recursiveMap
import {
  map,
  genericInterfaceMap,
  recursiveMap,
  findInterface,
  parseInterface,
  resetInterfaceMap,
  shouldSkipGenerate,
} from '../parse/interface'
import { genJsDocTypeDef } from '../..'
import { DEFAULT_HEAD_JS_DOC_TYPES } from '../default'

const compileJsDocType = (
  source: OpenAPIV2.Document,
  interfaceName: string,
  noContext = false
): string => {
  if (!source.definitions || shouldSkipGenerate(interfaceName, noContext))
    return ''
  parseInterface(source.definitions, interfaceName)

  try {
    return genJsDocTypeDef(findInterface(interfaceName))
  } catch (e) {
    console.warn(`jsDoc: ${interfaceName} 生成失败，检查是否符合 swagger 规范`)
    console.warn(e)
    return `
    // jsDoc: ${interfaceName} 生成失败，检查是否符合 swagger 规范
    `
  }
}

// 生成全量 jsDoc type 代码
const compileJsDocTypes = (
  source: OpenAPIV2.Document,
  interfaceName?: string
): string => {
  if (!source.definitions) return ''
  resetInterfaceMap()

  if (interfaceName) {
    return compileJsDocType(source, interfaceName, true)
  } else {
    Object.keys(source.definitions).forEach((key) => {
      parseInterface(source.definitions!, key)
    })

    const jsDocTypesCode = Object.keys(map).reduce(
      (acc, cur) => acc + compileJsDocType(source, cur),
      ''
    )
    const recursiveJsDocTypesCode = Object.keys(recursiveMap).reduce(
      (acc, cur) => acc + genJsDocTypeDef(recursiveMap[cur]),
      ''
    )

    const jsDocTypesWithGenericCode = Object.keys(genericInterfaceMap).reduce(
      (acc, cur) => acc + genJsDocTypeDef(genericInterfaceMap[cur]),
      ''
    )
    return (
      DEFAULT_HEAD_JS_DOC_TYPES +
      jsDocTypesWithGenericCode +
      jsDocTypesCode +
      recursiveJsDocTypesCode
    )
  }
}

export { compileJsDocTypes, compileJsDocType }
