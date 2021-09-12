import { TemplateFunction, tsTemplate, jsTemplate } from 'free-swagger-core'
import camelcase from 'camelcase'
import { ApiConfig, isSwaggerDocument, MockConfig, isUrl } from '../utils'
import path from 'path'

export const DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios from "axios";`
export const DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`
export const DEFAULT_HEAD_CODE_TS = `
/* eslint-disable */
// @ts-nocheck 
// generated by free-swagger
// @see https://www.npmjs.com/package/free-swagger

`
export const DEFAULT_HEAD_CODE_JS = `
/* eslint-disable */
// generated by free-swagger
// @see https://www.npmjs.com/package/free-swagger

`

export const INTERFACE_PATH = './interface/index.ts' // interface 的相对路径
export const JSDOC_PATH = './typedef/index.js' // jsdoc 的相对路径

const DEFAULT_MOCK_CONFIG = {
  cookie: '',
  wrap: false,
  mockRoot: global.__DEV__
    ? path.resolve(__dirname, '../../test/mock/default')
    : path.resolve(process.cwd(), 'src/mock'),
}

export const getDefaultParams = (): Required<Omit<ApiConfig, 'source'>> => ({
  root: global.__DEV__
    ? path.resolve(__dirname, '../../test/api/default')
    : path.resolve(process.cwd(), 'src/api'),
  cookie: '',
  customImportCode: DEFAULT_CUSTOM_IMPORT_CODE_JS,
  lang: 'js',
  jsDoc: true,
  templateFunction: eval(jsTemplate),
  filename: (name) => camelcase(name),
})

export const mergeDefaultParams = (
  config: ApiConfig | string
): Required<ApiConfig> => {
  let mergedConfig: ApiConfig = <ApiConfig>{}

  if (typeof config === 'string') {
    mergedConfig.source = config
  } else if (isSwaggerDocument(config)) {
    mergedConfig.source = config
  } else {
    mergedConfig = config
  }

  // 给 interface/jsdoc 添加来源，便于回溯
  if (isUrl(mergedConfig.source)) {
    // @ts-ignore
    mergedConfig._url = mergedConfig.source
  }

  let templateFunction: TemplateFunction
  if (mergedConfig.templateFunction) {
    templateFunction = mergedConfig.templateFunction
  } else {
    templateFunction =
      mergedConfig.lang === 'ts' ? eval(tsTemplate) : eval(jsTemplate)
  }

  return {
    ...getDefaultParams(),
    customImportCode:
      mergedConfig.lang === 'ts'
        ? DEFAULT_CUSTOM_IMPORT_CODE_TS
        : DEFAULT_CUSTOM_IMPORT_CODE_JS,
    templateFunction,
    ...mergedConfig,
  }
}

export const mergeDefaultMockConfig = (
  config: MockConfig | string
): Required<MockConfig> => {
  const mergedConfig: MockConfig = <MockConfig>{}

  if (typeof config === 'string') {
    mergedConfig.source = config
  } else if (isSwaggerDocument(config)) {
    mergedConfig.source = config
  } else {
    return { ...DEFAULT_MOCK_CONFIG, ...config }
  }
  return { ...DEFAULT_MOCK_CONFIG, ...mergedConfig }
}
