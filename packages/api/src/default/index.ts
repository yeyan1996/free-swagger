import { jsTemplate } from 'free-swagger-core'
import {
  ApiConfig,
  MockConfig,
  isSwaggerDocument,
  isUrl,
  checkAndNormalizePath,
} from '../utils'
import { mergeDefaultParams as mergeDefaultParamsCore } from 'free-swagger-core'
import camelcase from 'camelcase'
import path from 'path'
import { OpenAPIV2 } from 'openapi-types'
import { fetchJSON } from '../request'
import fse from 'fs-extra'
import { isObject } from 'lodash'

export const DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios from "axios";`
export const DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`

export const INTERFACE_PATH = './interface/index.ts' // interface 的相对路径
export const JSDOC_PATH = './typedef/index.js' // jsdoc 的相对路径

export const DEFAULT_MOCK_CONFIG = {
  cookie: '',
  wrap: false,
  mockRoot: global.__DEV__
    ? global.__PATH__ || path.resolve(__dirname, '../../test/mock/default')
    : path.resolve(process.cwd(), 'src/mock'),
}

export const getDefaultParams = (): Required<Omit<ApiConfig, 'source'>> => ({
  root: global.__DEV__
    ? global.__PATH__ || path.resolve(__dirname, '../../test/api/default')
    : path.resolve(process.cwd(), 'src/api'),
  cookie: '',
  header: DEFAULT_CUSTOM_IMPORT_CODE_JS,
  lang: 'js',
  jsDoc: true,
  templateFunction: eval(jsTemplate),
  filename: (name) => camelcase(name),
  typeOnly: false,
})

// 加载本地/远程 swagger
export const loadSwaggerDocument = async (
  source: string | OpenAPIV2.Document,
  cookie?: string
): Promise<OpenAPIV2.Document> => {
  if (!source) {
    throw new Error('source 不存在，请检查配置文件')
  }
  if (isUrl(source)) {
    return fetchJSON(source, cookie)
  } else if (checkAndNormalizePath(source)) {
    const filepath = checkAndNormalizePath(source) as string
    return JSON.parse(await fse.readFile(filepath, 'utf-8'))
  } else {
    return source
  }
}

// api 侧合并 + 格式化默认参数
export const mergeDefaultParams = async (
  config: ApiConfig | string
): Promise<Required<ApiConfig<OpenAPIV2.Document>>> => {
  let mergedConfig: ApiConfig<OpenAPIV2.Document | string> = {} as ApiConfig<
    OpenAPIV2.Document | string
  >

  const processSource = async (source: string | OpenAPIV2.Document) => {
    // 给 interface/jsdoc 添加来源，便于回溯
    if (isUrl(source)) {
      // @ts-ignore
      mergedConfig._url = isObject(config) ? config.source ?? '' : config
    }
    // 请求源文件/加载 json 模块，并重写
    mergedConfig.source = await loadSwaggerDocument(source, mergedConfig.cookie)
  }

  // 只传 url 参数 | 只传 json 参数
  if (typeof config === 'string' || isSwaggerDocument(config)) {
    await processSource(config)
  } else {
    // 传了完整的 config
    mergedConfig = config
    if (typeof mergedConfig.source === 'string') {
      await processSource(mergedConfig.source)
    }
  }

  if (!isSwaggerDocument(mergedConfig.source)) {
    throw new Error('swagger 文档不规范，请检查参数格式')
  }

  // 合并 core 的默认参数
  mergedConfig = await mergeDefaultParamsCore(
    mergedConfig as ApiConfig<OpenAPIV2.Document>
  )

  return {
    ...getDefaultParams(),
    header:
      mergedConfig.lang === 'ts'
        ? DEFAULT_CUSTOM_IMPORT_CODE_TS
        : DEFAULT_CUSTOM_IMPORT_CODE_JS,
    ...(mergedConfig as ApiConfig<OpenAPIV2.Document>),
  }
}

export const mergeDefaultMockConfig = async (
  config: MockConfig | string
): Promise<Required<MockConfig<OpenAPIV2.Document>>> => {
  let mergedConfig: MockConfig = <MockConfig>{}

  if (typeof config === 'string' || isSwaggerDocument(config)) {
    mergedConfig.source = await loadSwaggerDocument(config, mergedConfig.cookie)
  } else {
    mergedConfig = config
  }

  return {
    ...DEFAULT_MOCK_CONFIG,
    ...(mergedConfig as ApiConfig<OpenAPIV2.Document>),
  }
}
