import { isParsedSchemaObject, ParsedInterface, ParsedSchema } from '../..'
import { ParsedApi } from '../..'
import { isEmpty } from 'lodash'

const genJsDocTypeDef = ({
  name,
  props,
  code,
  description,
}: ParsedInterface): string => {
  return code
    ? code
    : `/**
 * @typedef ${name}${description ? ` - ${description}` : ''}
${
  props &&
  Object.entries(props)
    .map(
      ([propName, prop]) => ` * @property {${prop.formatType}} ${propName}${
        prop.description ? ` - ${prop.description}` : ''
      }
`
    )
    .join('')
    .trimEnd()
}
**/
`
}

type Condition = (params: {
  IQueryParams: any
  IBodyParams: any
  pathParams: any
}) => boolean

type CodeFunction = (params: {
  IQueryParams: any
  IBodyParams: any
  IPathParams: any
  pathParams: any
  queryDescription: any
  bodyDescription: any
  queryParamsInterface: ParsedSchema
  pathParamsInterface: ParsedSchema
  bodyParamsInterface: ParsedSchema
}) => string

const genJsDocSchema = (paramsInterface?: ParsedSchema): string => {
  if (!paramsInterface || isEmpty(paramsInterface)) return ''
  if (isParsedSchemaObject(paramsInterface)) {
    return paramsInterface.formatType
  } else {
    return 'Object'
  }
}

const genJsDocPropertyCode = (
  paramsInterface: ParsedSchema,
  paramsName = 'params'
): string => {
  if (isParsedSchemaObject(paramsInterface)) return ''
  return Object.entries(paramsInterface)
    .map(
      ([propName, prop]) => `
 * @param {${prop.formatType}} ${paramsName}.${propName} ${
        prop.description ? `- ${prop.description}` : ''
      }`
    )
    .join('')
}

const genJsDoc = ({
  queryParamsInterface,
  bodyParamsInterface,
  pathParamsInterface,
  deprecated,
  summary,
}: ParsedApi): string => {
  const { IBodyParams, IQueryParams, IPathParams } = {
    IQueryParams: genJsDocSchema(queryParamsInterface),
    IBodyParams: genJsDocSchema(bodyParamsInterface),
    IPathParams: genJsDocSchema(pathParamsInterface),
  }
  const pathCode = IPathParams
    ? `\n * @param {Object} pathParams${genJsDocPropertyCode(
        pathParamsInterface,
        'pathParams'
      )}`
    : ''

  // 有 query 和 body 参数
  const multipleParamsCondition: Condition = ({ IQueryParams, IBodyParams }) =>
    IQueryParams && IBodyParams

  const firstParamCodeMap = new Map<Condition, CodeFunction | string>()
    // 只有 query 参数，可能有 path 参数
    .set(
      ({ IQueryParams, IBodyParams }) => IQueryParams && !IBodyParams,
      ({ IQueryParams, queryDescription, queryParamsInterface }) =>
        `\n * @param {${IQueryParams}} params ${queryDescription}${genJsDocPropertyCode(
          queryParamsInterface
        )}`
    )
    // 只有 body 参数，可能有 path 参数
    .set(
      ({ IQueryParams, IBodyParams }) => IBodyParams && !IQueryParams,
      ({ IBodyParams, bodyDescription, bodyParamsInterface }) =>
        `\n * @param {${IBodyParams}} params ${bodyDescription}${genJsDocPropertyCode(
          bodyParamsInterface
        )}`
    )
    // 有 query 和 body 参数，可能有 path 参数
    .set(
      multipleParamsCondition,
      ({ IQueryParams, queryDescription, queryParamsInterface }) =>
        `\n * @param {${IQueryParams}} queryParams ${queryDescription}${genJsDocPropertyCode(
          queryParamsInterface,
          'queryParams'
        )}`
    )
    // 没有 query body 参数，有 path 参数
    .set(
      ({ IQueryParams, pathParams, IBodyParams }) =>
        !IBodyParams && !IQueryParams && pathParams.length,
      '\n * @param {Object} _NOOP - never'
    )
    // 只有 path 参数
    .set(
      ({ pathParams }) => pathParams.length,
      () => pathCode
    )

  const secondParamCodeMap = new Map<Condition, CodeFunction | string>()
    // 有 path 参数
    .set(
      ({ pathParams }) => pathParams.length,
      () => pathCode
    )
    // 有 query 和 body 参数，有 path 参数
    .set(multipleParamsCondition, '\n * @param {Object} _NOOP - never')

  const thirdParamCodeMap = new Map<Condition, CodeFunction>()
    // 有 query 和 body 参数，有 path 参数
    .set(
      multipleParamsCondition,
      ({ IBodyParams, bodyDescription, bodyParamsInterface }) =>
        `\n * @param {${IBodyParams}} bodyParams ${bodyDescription}${genJsDocPropertyCode(
          bodyParamsInterface,
          'bodyParams'
        )}`
    )

  const createParamCode = (
    conditionMap: Map<Condition, CodeFunction | string>,
    defaultCode = ''
  ) => {
    let code = defaultCode
    for (const [condition, codeFunction] of conditionMap.entries()) {
      const queryDescription = queryParamsInterface.description
        ? `- ${queryParamsInterface.description}`
        : ''
      const bodyDescription = bodyParamsInterface.description
        ? `- ${bodyParamsInterface.description}`
        : ''
      const pathParams = Object.keys(pathParamsInterface)

      const res = condition({
        IQueryParams,
        IBodyParams,
        pathParams,
      })
      if (res) {
        code =
          typeof codeFunction === 'string'
            ? codeFunction
            : codeFunction({
                IQueryParams,
                IBodyParams,
                IPathParams,
                pathParams,
                queryDescription,
                bodyDescription,
                queryParamsInterface,
                pathParamsInterface,
                bodyParamsInterface,
              })
        break
      }
    }
    return code
  }

  return `/** ${
    deprecated
      ? `
 * @deprecated`
      : ''
  }
 * @description ${summary} ${createParamCode(
    firstParamCodeMap
  )} ${createParamCode(secondParamCodeMap)} ${createParamCode(
    thirdParamCodeMap
  )} 
**/
`
}

export { genJsDocTypeDef, genJsDoc }
