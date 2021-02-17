import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { OpenAPIV2 } from 'openapi-types'
import {
  isUrl,
  isPath,
  assertOpenApi2,
  MockConfig,
  ServerConfig,
} from './utils'
import { mergeDefaultParams, mergeDefaultMockConfig } from './default'
import { isFunction } from 'lodash'
import { ApiCollection, parsePaths } from './parse/path'
import { compileInterfaces, compileJsDocTypeDefs } from 'free-swagger-client'
import { ParsedPaths } from './parse/path'
import { genPaths } from './gen/path'
import { fetchJSON } from './request'
import { INTERFACE_PATH, JSDOC_PATH } from './default'
import { mock } from './mock'

export const spinner = ora().render()

// parse swagger json
const parse = async (
  config: ServerConfig<OpenAPIV2.Document>
): Promise<{
  paths: ParsedPaths
}> => {
  fse.ensureDirSync(config.root!)
  const paths = parsePaths(config.source)
  return { paths }
}

// code generate
const gen = async (
  config: Required<ServerConfig<OpenAPIV2.Document>>,
  dirPath: string,
  paths: ParsedPaths
): Promise<void> => {
  // 生成 interface
  if (config.lang === 'ts') {
    const interfacePath = path.resolve(dirPath, INTERFACE_PATH)
    fse.ensureFileSync(interfacePath)
    await fse.writeFile(interfacePath, compileInterfaces(config.source))
  }

  if (config.lang === 'js' && config.useJsDoc) {
    const jsDocPath = path.resolve(dirPath, JSDOC_PATH)
    fse.ensureFileSync(jsDocPath)
    await fse.writeFile(jsDocPath, compileJsDocTypeDefs(config.source))
  }

  // 生成 api
  const genApi = async ([name, apiCollection]: [
    string,
    ApiCollection
  ]): Promise<void> => {
    const apiCollectionPath = path.resolve(
      dirPath,
      `${config.filename?.(name) ?? name}.${config.lang}`
    )
    fse.ensureFileSync(apiCollectionPath)
    const code = genPaths(apiCollection, config)
    await fse.writeFile(apiCollectionPath, code)
  }

  Object.entries(paths).forEach(genApi)
}

const normalizeSource = async (
  source: string | OpenAPIV2.Document,
  cookie?: string
): Promise<OpenAPIV2.Document> => {
  if (!source) {
    throw new Error('source 不存在，请检查配置文件')
  }
  if (isUrl(source)) {
    return await fetchJSON(source, cookie)
  }
  if (isPath(source)) {
    const sourcePath = path.resolve(process.cwd(), source)
    return JSON.parse(await fse.readFile(sourcePath, 'utf-8'))
  }
  return source
}

// compile = parse + gen
const compile = async (
  config: Required<ServerConfig>,
  events: {
    onChooseApi?: (params: { paths: ParsedPaths }) => Promise<ParsedPaths>
  } = {}
): Promise<any> => {
  try {
    config.source = await normalizeSource(config.source, config.cookie)
    if (!assertOpenApi2(config)) {
      throw new Error('文档解析错误，请使用 openApi2 规范的文档')
    }
    spinner.start('正在生成 api 文件...')
    fse.ensureDirSync(config.root)

    // parse
    const { paths } = await parse(config)
    spinner.succeed('api 文件解析完成')

    const choosePaths = isFunction(events?.onChooseApi)
      ? await events?.onChooseApi?.({ paths })
      : paths

    // gen
    await gen(config, config.root, choosePaths)
    spinner.succeed(
      `api 文件生成成功，文件根目录地址: ${chalk.green(config.root)}`
    )
    return config.source
  } catch (e) {
    spinner.fail(`${chalk.red('api 文件生成失败')}`)
    throw new Error(e)
  }
}

// freeSwagger = merge + compile
const freeSwagger = async (
  config: ServerConfig | string
): Promise<OpenAPIV2.Document> => {
  const mergedConfig = await mergeDefaultParams(config)
  return await compile(mergedConfig)
}

freeSwagger.compile = compile
freeSwagger.mock = async (config: MockConfig | string): Promise<void> => {
  const mergedConfig = mergeDefaultMockConfig(config)
  const source = await normalizeSource(mergedConfig.source, mergedConfig.cookie)
  await mock({ ...mergedConfig, source })
  spinner.succeed(
    `mock 文件生成成功，路径: ${chalk.green(
      path.resolve(mergedConfig.mockRoot)
    )}`
  )
}

import * as utils from './utils'
import * as defaults from './default'

Object.assign(freeSwagger, utils, defaults)
module.exports = freeSwagger
