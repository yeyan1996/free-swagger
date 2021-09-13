import { jsTemplate } from 'free-swagger-core'
import {
  ApiConfig,
  MockConfig,
  isSwaggerDocument,
  isUrl,
  isPath,
} from '../utils'
import { mergeDefaultParams as mergeDefaultParamsCore } from 'free-swagger-core'
import camelcase from 'camelcase'
import path from 'path'
import { OpenAPIV2 } from 'openapi-types'
import { fetchJSON } from '../request'
import fse from 'fs-extra'

export const DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios from "axios";`
export const DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`

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
  typeOnly: false,
})

export const normalizeSource = async (
  source: string | OpenAPIV2.Document,
  cookie?: string
): Promise<OpenAPIV2.Document> => {
  if (!source) {
    throw new Error('source 不存在，请检查配置文件')
  }
  if (isUrl(source)) {
    return fetchJSON(source, cookie)
  }
  if (isPath(source)) {
    const sourcePath = path.resolve(process.cwd(), source)
    return JSON.parse(await fse.readFile(sourcePath, 'utf-8'))
  }
  return source
}

// api 侧合并 + 格式化默认参数
export const mergeDefaultParams = async (
  config: ApiConfig | string
): Promise<Required<ApiConfig>> => {
  let mergedConfig: ApiConfig = {} as ApiConfig

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

  // 请求源文件/加载 json 模块，并重写
  mergedConfig.source = await normalizeSource(
    mergedConfig.source,
    mergedConfig.cookie
  )

  // 合并 core 的默认参数
  mergedConfig = mergeDefaultParamsCore(
    mergedConfig as ApiConfig<OpenAPIV2.Document>
  )

  return {
    ...getDefaultParams(),
    customImportCode:
      mergedConfig.lang === 'ts'
        ? DEFAULT_CUSTOM_IMPORT_CODE_TS
        : DEFAULT_CUSTOM_IMPORT_CODE_JS,
    ...mergedConfig,
  }
}

export const mergeDefaultMockConfig = async (
  config: MockConfig | string
): Promise<Required<MockConfig<OpenAPIV2.Document>>> => {
  const mergedConfig: MockConfig = <MockConfig>{}

  if (typeof config === 'string' || isSwaggerDocument(config)) {
    mergedConfig.source = config
  } else {
    mergedConfig.source = config.source
  }

  mergedConfig.source = await normalizeSource(
    mergedConfig.source,
    mergedConfig.cookie
  )

  // @ts-ignore
  return { ...DEFAULT_MOCK_CONFIG, ...mergedConfig }
}
