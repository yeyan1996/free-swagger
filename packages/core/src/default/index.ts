import { ClientConfig } from '../utils'
import { jsTemplate, tsTemplate } from './template'

export const mergeDefaultParams = (
  config: ClientConfig
): Required<ClientConfig> => ({
  jsDoc: true,
  interface: false,
  typedef: false,
  recursive: false,
  lang: 'js',
  templateFunction: config.lang === 'js' ? eval(jsTemplate) : eval(tsTemplate),
  ...config,
})

export const DEFAULT_HEAD_INTERFACE = `/* eslint-disable */
// @ts-nocheck
// generated by free-swagger-core
// @see https://www.npmjs.com/package/free-swagger-core
`

export const DEFAULT_HEAD_JS_DOC_TYPES = `// generated by free-swagger-core
// @see https://www.npmjs.com/package/free-swagger-core
`