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
import {
  mergeDefaultParams,
  mergeDefaultMockConfig,
  DEFAULT_HEAD_CODE_TS,
  DEFAULT_HEAD_CODE_JS,
} from './default'
import { isFunction, uniq } from 'lodash'
import { ParsedPathsObject, ParsedPaths, parsePaths } from './parse/path'
import {
  compileInterfaces,
  compileJsDocTypedefs,
  formatCode,
  compilePath,
} from 'free-swagger-client'
import { fetchJSON } from './request'
import { INTERFACE_PATH, JSDOC_PATH } from './default'
import { mock } from './mock'

export const spinner = ora().render()

// 使用 free-swagger 时传入 free-swagger-client 的部分参数固定
const DEFAULT_PARAMS = {
  jsDoc: true,
  interface: false,
  recursive: false,
  typedef: false,
}

// parse swagger json
const parse = (
  config: ServerConfig<OpenAPIV2.Document>
): {
  parsedPathsObject: ParsedPathsObject
} => {
  fse.ensureDirSync(config.root!)
  return { parsedPathsObject: parsePaths(config.source) }
}

// code generate
const gen = async (
  config: Required<ServerConfig<OpenAPIV2.Document>>,
  dirPath: string,
  pathsObject: ParsedPathsObject
): Promise<void> => {
  // 生成 interface
  if (config.lang === 'ts') {
    const interfacePath = path.resolve(dirPath, INTERFACE_PATH)
    fse.ensureFileSync(interfacePath)
    await fse.writeFile(
      interfacePath,
      compileInterfaces({ source: config.source }).code
    )
  }

  // 生成 js doc type
  if (config.lang === 'js') {
    const jsDocPath = path.resolve(dirPath, JSDOC_PATH)
    fse.ensureFileSync(jsDocPath)
    await fse.writeFile(
      jsDocPath,
      compileJsDocTypedefs({ source: config.source }).code
    )
  }

  // 生成单个 api 文件
  const genApi = async ([filename, parsedPaths]: [
    string,
    ParsedPaths
  ]): Promise<void> => {
    const apiCollectionPath = path.resolve(
      dirPath,
      `${config.filename?.(filename) ?? filename}.${config.lang}`
    )
    fse.ensureFileSync(apiCollectionPath)
    let code = ''
    const imports: string[] = []
    code += config.lang === 'ts' ? DEFAULT_HEAD_CODE_TS : DEFAULT_HEAD_CODE_JS
    code += `\n`

    let apisCode = ''
    parsedPaths.forEach((parsedPath) => {
      const { jsDocCode, code, imports: apiImports } = compilePath(
        {
          ...config,
          ...DEFAULT_PARAMS,
        },
        parsedPath.url,
        parsedPath.method
      )
      imports.push(...apiImports)
      if (config.lang === 'js') {
        apisCode += jsDocCode + code
      } else {
        apisCode += code
      }
      apisCode += `\n`
    })
    code +=
      config.lang === 'ts' && imports.length
        ? `import {${uniq(imports).join(',')}} from "${INTERFACE_PATH}";`
        : ''
    code += `${config.customImportCode}\n\n`
    code += apisCode

    await fse.writeFile(apiCollectionPath, formatCode(config.lang)(code))
  }

  Object.entries(pathsObject).forEach(genApi)
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
    onChooseApi?: (params: {
      paths: ParsedPathsObject
    }) => Promise<ParsedPathsObject>
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
    const { parsedPathsObject } = parse(config)
    spinner.succeed('api 文件解析完成')

    const choosePaths = isFunction(events?.onChooseApi)
      ? await events?.onChooseApi?.({ paths: parsedPathsObject })
      : parsedPathsObject

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
