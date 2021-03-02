import { OpenAPIV2 } from 'openapi-types'
import { ClientConfig } from 'free-swagger-client'
import fse from 'fs-extra'
import camelcase from 'camelcase'
import path from 'path'
import chalk from 'chalk'
import assert from 'assert'

export interface ServerConfig<T = string | OpenAPIV2.Document>
  extends Omit<ClientConfig, 'source' | 'interface' | 'typedef' | 'recursive'> {
  source: T
  cookie?: string
  root?: string
  customImportCode?: string
  filename?(name: string): string
}

export interface MockConfig<T = string | OpenAPIV2.Document> {
  source: T
  cookie?: string
  wrap?: boolean
  mockRoot?: string
}

const isUrl = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === 'string' && url.startsWith('http')
const isPath = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === 'string' && fse.existsSync(path.resolve(process.cwd(), url))
const isSwaggerDocument = (value: any): value is OpenAPIV2.Document =>
  !!value.swagger

const assertOpenApi2 = (
  config: ServerConfig
): config is ServerConfig<OpenAPIV2.Document> => {
  // @ts-ignore
  if (config.source?.swagger) {
    // @ts-ignore
    const version = config.source.swagger
    console.log('openApi version:', chalk.yellow(version))
    assert(version.startsWith('2.', 0))
    return true
  } else {
    return false
  }
}

const pascalCase = (str: string): string =>
  camelcase(str, {
    pascalCase: true,
  })

const hasChinese = (str: string): boolean =>
  /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str)

export {
  isUrl,
  isPath,
  assertOpenApi2,
  pascalCase,
  hasChinese,
  isSwaggerDocument,
}
