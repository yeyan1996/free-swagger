import { isParsedSchemaObject, ParsedInterface, ParsedSchema } from '../..'
import { Api } from '../..'
import { isEmpty } from 'lodash'

const genJsDocTypeDef = ({
  name,
  props,
  skipGenerate,
}: ParsedInterface): string => {
  return skipGenerate
    ? ''
    : `
/**
 * @typedef {
 *   {
${Object.entries(props)
  .map(
    ([propName, prop]) => ` *     ${propName}: ${prop.type}
`
  )
  .join('')} *   }
 * } ${name}
**/
`
}

const genJsDocSchema = (paramsInterface?: ParsedSchema): string => {
  if (!paramsInterface || isEmpty(paramsInterface)) return ''

  if (isParsedSchemaObject(paramsInterface)) {
    return paramsInterface.type
  } else {
    return `{
    ${Object.entries(paramsInterface)
      .map(
        ([propName, prop], index) =>
          // format
          `${index !== 0 ? '    ' : ''}"${propName}": ${prop.type}`
      )
      .join('\n')}
}`
  }
}

const genIParams = ({
  pathParamsInterface,
  queryParamsInterface,
  bodyParamsInterface,
}: Api): {
  IPathParams: string
  IQueryParams: string
  IBodyParams: string
} => ({
  IQueryParams: genJsDocSchema(queryParamsInterface),
  IBodyParams: genJsDocSchema(bodyParamsInterface),
  IPathParams: genJsDocSchema(pathParamsInterface),
})

const genJsDoc = (api: Api): string => {
  const { IBodyParams, IQueryParams } = genIParams(api)

  const onlyIQueryParams = !isEmpty(IQueryParams) && isEmpty(IBodyParams)
  const onlyIBodyParams = !isEmpty(IBodyParams) && isEmpty(IQueryParams)
  const multipleParams = !isEmpty(IBodyParams) && !isEmpty(IQueryParams)
  const hasPathParams = !isEmpty(api.pathParamsInterface)

  const queryDescription = api.queryParamsInterface.description
    ? `-${api.queryParamsInterface.description}`
    : ''
  const bodyDescription = api.bodyParamsInterface.description
    ? `-${api.bodyParamsInterface.description}`
    : ''

  const pathCode = hasPathParams
    ? ` * @param {Object} pathParams
${Object.entries(api.pathParamsInterface)
  .map(
    ([propName, prop], index) =>
      // format
      `${index !== 0 ? '    ' : ''} * @param {${
        prop.type
      }} pathParams.${propName} ${
        prop.description ? `-${prop.description}` : ''
      }`
  )
  .join('\n')}
  `
    : ''

  const queryCode = onlyIQueryParams
    ? ` 
 * @param {${IQueryParams}} params ${queryDescription}
${pathCode}`
    : ''

  const bodyCode = onlyIBodyParams
    ? ` 
 * @param {${IBodyParams}} params ${bodyDescription}
${pathCode}`
    : ''

  const multiCode = multipleParams
    ? ` 
 * @param {${IQueryParams}} queryParams ${queryDescription}
${pathCode}
 * @param {${IBodyParams}} bodyParams ${bodyDescription}`
    : ''

  return `
/** ${
    api.deprecated
      ? `
 * @deprecated`
      : ''
  }
 * @description ${api.summary} ${
    multipleParams
      ? multiCode
      : onlyIBodyParams
      ? bodyCode
      : onlyIQueryParams
      ? queryCode
      : hasPathParams
      ? `
 * @param {Object} params -never
${pathCode}`
      : ''
  } **/`
}

export { genJsDocTypeDef, genJsDoc }
