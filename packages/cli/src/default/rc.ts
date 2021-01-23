import path from 'path'
import os from 'os'
import fse from 'fs-extra'
import prettier from 'prettier'
import { pick, mergeWith, omit } from 'lodash'
import { EOL } from 'os'
import { ClientConfig, jsTemplate, tsTemplate } from 'free-swagger-client'
import {
  DEFAULT_CUSTOM_IMPORT_CODE_JS,
  DEFAULT_CUSTOM_IMPORT_CODE_TS,
  MockConfig,
  ServerConfig,
} from 'free-swagger'
import { execSync } from 'child_process'
import camelcase from 'camelcase'

type Type = 'client' | 'server' | 'mock'

const MODULE_EXPORTS = 'module.exports ='
const EXPORT_DEFAULT = 'export default'

export interface RcConfig {
  client: Omit<Required<ClientConfig<string>>, 'filename'> & {
    tsTemplate: string
    jsTemplate: string
  }
  server: {
    root: string
    cookie: string
    previousSource: string
    apiChoices: { name: string; checked: boolean }[]
    shouldEditTemplate: boolean
    customImportCode: string
    customImportCodeJs: string
    customImportCodeTs: string
  }
  mock: {
    mockRoot: string
    wrap: boolean
  }
}

class Rc {
  path: string
  configData: RcConfig

  constructor() {
    this.path = path.resolve(os.homedir(), '.free-swaggerrc.js')
    fse.ensureFileSync(this.path)
    let rcConfig
    try {
      rcConfig = require(this.path) as RcConfig
    } catch (e) {
      // 兼容
      const content = fse.readFileSync(this.path, 'utf-8') || '{}'
      fse.writeFileSync(
        this.path,
        content.replace(EXPORT_DEFAULT, MODULE_EXPORTS)
      )
      rcConfig = require(this.path) as RcConfig
    }
    this.configData = {
      ...this.getDefaultConfig(),
      ...pick(rcConfig),
    }
  }

  // 获取默认 rc 文件
  getDefaultConfig(): RcConfig {
    return {
      client: {
        source: 'https://petstore.swagger.io/v2/swagger.json',
        lang: 'js',
        templateFunction: eval(jsTemplate),
        useJsDoc: true,
        tsTemplate,
        jsTemplate,
      },
      server: {
        root: path.resolve(process.cwd(), 'src/api'),
        cookie: '',
        previousSource: '',
        apiChoices: [],
        shouldEditTemplate: false,
        customImportCode: '',
        customImportCodeJs: DEFAULT_CUSTOM_IMPORT_CODE_JS,
        customImportCodeTs: DEFAULT_CUSTOM_IMPORT_CODE_TS,
      },
      mock: {
        mockRoot: global.__DEV__
          ? path.resolve(__dirname, '../../test/mock/default')
          : path.resolve(process.cwd(), 'src/mock'),
        wrap: false,
      },
    }
  }

  // 从 rc 文件中生成 free-swagger-cli 参数
  createFreeSwaggerParams(
    { client, server }: RcConfig = this.configData
  ): Required<ServerConfig> {
    const { lang, templateFunction } = client
    const { customImportCodeJs, customImportCodeTs } = server
    return {
      ...pick(client, ['source', 'lang', 'useJsDoc']),
      ...pick(server, ['root', 'cookie']),
      templateFunction,
      filename: (name) => camelcase(name),
      customImportCode: lang === 'ts' ? customImportCodeTs : customImportCodeJs,
    }
  }

  // 从 rc 文件中生成 mock 参数
  createMockParams({ mock, client }: RcConfig = this.configData): MockConfig {
    return {
      ...pick(client, ['source']),
      ...mock,
    }
  }

  // 合并配置项
  merge(answer: object, type: Type = 'client'): void {
    // @ts-ignore
    this.configData[type] = mergeWith(
      this.configData[type],
      answer,
      (old, now) => {
        if (now == null) return old
      }
    )
  }

  private stringifyConfigData(rcConfig: RcConfig): string {
    const data = JSON.stringify(rcConfig)
    // hack: 由于 JSON.stringify 不能保存函数，这里手动将函数拼接并写入 rc 文件
    // 去除尾部分号，否则会报词法错误
    let templateFunction = this.configData.client.templateFunction
      ?.toString()
      .replace(EOL, '')
      .trim()
    if (templateFunction?.endsWith(';')) {
      templateFunction = templateFunction.slice(0, templateFunction.length - 1)
    }
    const functionCode = `templateFunction: ${templateFunction}`
    const index = data.search(/"source"/)
    const prevCode = data.slice(0, index)
    const afterCode = data.slice(index, data.length)
    return prettier.format(
      `${MODULE_EXPORTS} ${prevCode} ${functionCode}, ${afterCode}`,
      {
        parser: 'babel',
      }
    )
  }

  // 将配置项存储至 rc 文件
  save(targetPath = this.path): void {
    const code = this.stringifyConfigData(this.configData)
    fse.writeFileSync(targetPath, code)
  }

  // 记录当前 source 和之前的 source
  // 对比两者判断是否需要清空用户选择的 api 缓存记录
  recordHash(newSource: string): void {
    this.configData.server.previousSource = this.configData.client.source
    this.configData.client.source = newSource
  }

  // 是否清空用户选择的 api 缓存记录
  shouldRefreshCache(): boolean {
    return (
      this.configData.server.previousSource !== this.configData.client.source
    )
  }

  // 重置为默认配置项
  reset(): void {
    this.configData = this.getDefaultConfig()
    fse.unlinkSync(this.path)
    this.save()
  }

  // 查看配置项
  show(): void {
    console.log(this.configData)
  }

  // 打开编辑器编辑模版
  edit(): void {
    execSync(`code ${this.path}`, { stdio: 'inherit' })
  }

  init(): void {
    const rcConfig = this.getDefaultConfig()
    fse.writeFileSync(
      path.resolve(process.cwd(), '.free-swaggerrc.js'),
      this.stringifyConfigData({
        // @ts-ignore
        client: omit(rcConfig.client, ['jsTemplate', 'tsTemplate']),
        server: rcConfig.server,
        mock: rcConfig.mock,
      })
    )
  }
}

export const rc = new Rc()
