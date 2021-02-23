import { isParsedSchemaObject, ParsedInterface, ParsedSchema } from '../..'
import { ParsedApi } from '../..'
import { isEmpty } from 'lodash'

const genJsDocTypeDef = ({ name, props, code }: ParsedInterface): string => {
  return code
    ? code
    : `
/**
 * @typedef {
 *   {
${
  props &&
  Object.entries(props)
    .map(
      ([propName, prop]) => ` *     '${propName}': ${prop.formatType}
`
    )
    .join('')
} *   }
 * } ${name}
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
}) => string

const genJsDocSchema = (paramsInterface?: ParsedSchema): string => {
  if (!paramsInterface || isEmpty(paramsInterface)) return ''

  if (isParsedSchemaObject(paramsInterface)) {
    return paramsInterface.formatType
  } else {
    return `{
    ${Object.entries(paramsInterface)
      .map(
        ([propName, prop], index) =>
          // format
          `${index !== 0 ? '    ' : ''}"${propName}": ${prop.formatType}`
      )
      .join('\n')}
}`
  }
}

const genIParams = ({
  pathParamsInterface,
  queryParamsInterface,
  bodyParamsInterface,
}: ParsedApi): {
  IPathParams: string
  IQueryParams: string
  IBodyParams: string
} => ({
  IQueryParams: genJsDocSchema(queryParamsInterface),
  IBodyParams: genJsDocSchema(bodyParamsInterface),
  IPathParams: genJsDocSchema(pathParamsInterface),
})

const genJsDoc = (api: ParsedApi): string => {
  const { IBodyParams, IQueryParams, IPathParams } = genIParams(api)
  const pathCode = IPathParams
    ? `\n * @param {Object} pathParams
${Object.entries(api.pathParamsInterface)
  .map(
    ([propName, prop]) =>
      // format
      ` * @param {${prop.formatType}} pathParams.${propName} ${
        prop.description ? `-${prop.description}` : ''
      }`
  )
  .join('\n')}`
    : ''

  // 有 query 和 body 参数
  const multipleParamsCondition: Condition = ({ IQueryParams, IBodyParams }) =>
    IQueryParams && IBodyParams

  const firstParamCodeMap = new Map<Condition, CodeFunction | string>()
    // 只有 query 参数，可能有 path 参数
    .set(
      ({ IQueryParams, IBodyParams }) => IQueryParams && !IBodyParams,
      ({ IQueryParams, queryDescription }) =>
        `\n * @param {${IQueryParams}} params ${queryDescription}`
    )
    // 只有 body 参数，可能有 path 参数
    .set(
      ({ IQueryParams, IBodyParams }) => IBodyParams && !IQueryParams,
      ({ IBodyParams, bodyDescription }) =>
        `\n * @param {${IBodyParams}} params ${bodyDescription}`
    )
    // 有 query 和 body 参数，可能有 path 参数
    .set(
      multipleParamsCondition,
      ({ IQueryParams, queryDescription }) =>
        `\n * @param {${IQueryParams}} queryParams ${queryDescription}`
    )
    // 没有 query body 参数，有 path 参数
    .set(
      ({ IQueryParams, pathParams, IBodyParams }) =>
        !IBodyParams && !IQueryParams && pathParams.length,
      '\n * @param {Object} _NOOP -never'
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
    .set(multipleParamsCondition, '\n * @param {Object} _NOOP -never')

  const thirdParamCodeMap = new Map<Condition, CodeFunction>()
    // 有 query 和 body 参数，有 path 参数
    .set(
      multipleParamsCondition,
      ({ IBodyParams, bodyDescription }) =>
        `\n * @param {${IBodyParams}} bodyParams ${bodyDescription}`
    )

  const createParamCode = (
    conditionMap: Map<Condition, CodeFunction | string>,
    defaultCode = ''
  ) => {
    let code = defaultCode
    for (const [condition, codeFunction] of conditionMap.entries()) {
      const queryDescription = api.queryParamsInterface.description
        ? `-${api.queryParamsInterface.description}`
        : ''
      const bodyDescription = api.bodyParamsInterface.description
        ? `-${api.bodyParamsInterface.description}`
        : ''
      const pathParams = Object.keys(api.pathParamsInterface)

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
              })
        break
      }
    }
    return code
  }

  return `
/** ${
    api.deprecated
      ? `
 * @deprecated`
      : ''
  }
 * @description ${api.summary} ${createParamCode(
    firstParamCodeMap
  )} ${createParamCode(secondParamCodeMap)} ${createParamCode(
    thirdParamCodeMap
  )} 
**/
`
}

export { genJsDocTypeDef, genJsDoc }
