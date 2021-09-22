import { OpenAPIV2 } from 'openapi-types'
import { CoreConfig } from 'free-swagger-core'
import fse from 'fs-extra'
import camelcase from 'camelcase'
import path from 'path'

export interface ApiConfig<T = string | OpenAPIV2.Document>
  extends Omit<
    CoreConfig,
    'source' | 'interface' | 'typedef' | 'recursive' | 'jsDoc'
  > {
  source: T
  cookie?: string
  root?: string
  jsDoc?: boolean
  header?: string
  filename?(name: string): string
  typeOnly?: boolean
}

export interface MockConfig<T = string | OpenAPIV2.Document> {
  source: T
  cookie?: string
  wrap?: boolean
  mockRoot?: string
}

const isUrl = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === 'string' && url.startsWith('http')

// 是否是一个文件路径
const checkAndNormalizePath = (
  url: string | OpenAPIV2.Document
): string | false => {
  if (typeof url !== 'string') {
    return false
  }
  const filepath = path.isAbsolute(url) ? url : path.resolve(process.cwd(), url)
  if (fse.existsSync(filepath)) {
    return filepath
  } else if (fse.existsSync(`${filepath}.json`)) {
    return `${filepath}.json`
  } else {
    return false
  }
}
const isSwaggerDocument = (value: any): value is OpenAPIV2.Document =>
  !!value.swagger || !!value.openapi

const pascalCase = (str: string): string =>
  camelcase(str, {
    pascalCase: true,
  })

const hasChinese = (str: string): boolean =>
  /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str)

export {
  isUrl,
  checkAndNormalizePath,
  pascalCase,
  hasChinese,
  isSwaggerDocument,
}
