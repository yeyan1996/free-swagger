import path from 'path'
import os from 'os'
import fse from 'fs-extra'
import prettier from 'prettier'
import { pick, mergeWith } from 'lodash'
import { EOL } from 'os'
import { ClientConfig, jsTemplate, tsTemplate } from 'free-swagger-client'
import {
  DEFAULT_CUSTOM_IMPORT_CODE_JS,
  DEFAULT_CUSTOM_IMPORT_CODE_TS,
  ServerConfig,
} from 'free-swagger'
import { execSync } from 'child_process'

type Type = 'client' | 'cli' | 'mock'

const EXPORT_DEFAULT = 'export default'

export interface RcConfig {
  client: Omit<ClientConfig<string>, 'filename'> & {
    source: string
    tsTemplate: string
    jsTemplate: string
  }
  cli: {
    root: string
    cookie: string
    previousSource: string
    apiChoices: { name: string; checked: boolean }[]
    chooseAll: boolean
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

    const dataContent = fse.readFileSync(this.path, 'utf-8') || '{}'
    // hack: 目的是取出 rc 中的代码片段
    /* eslint-disable */
    let _obj = {}
    eval(`_obj = ${dataContent.replace(new RegExp(`^${EXPORT_DEFAULT}`), '')}`)
    this.configData = {
      ...this.getDefaultConfig(),
      ...pick(_obj, Object.keys(this.getDefaultConfig())),
    }
  }

  // 获取默认 rc 文件
  getDefaultConfig(): RcConfig {
    return {
      client: {
        source: '',
        lang: 'js',
        templateFunction: eval(jsTemplate),
        useJsDoc: true,
        tsTemplate,
        jsTemplate,
      },
      cli: {
        root: path.resolve(process.cwd(), 'src/api'),
        cookie: '',
        previousSource: '',
        apiChoices: [],
        chooseAll: false,
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
  createFreeSwaggerParams(): ServerConfig {
    const { lang, tsTemplate, jsTemplate ,templateFunction} = this.configData.client
    const { customImportCodeJs, customImportCodeTs } = this.configData.cli
    const defaultTemplateFunction = lang === 'ts' ? eval(tsTemplate) : eval(jsTemplate)
    return {
      ...pick(this.configData.client, [
        'source',
        'lang',
        'useJsDoc',
      ]),
      ...pick(this.configData.cli,['root',
          'cookie']),
      templateFunction,
      ...pick(this.configData.cli, ['chooseAll']),
      customImportCode: lang === 'ts' ? customImportCodeTs : customImportCodeJs,
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

  // 将配置项存储至 rc 文件
  save(): void {
    const data = JSON.stringify(this.configData)
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
    const prevCode = data.slice(0,index)
    const afterCode = data.slice(index,data.length)
    const code = prettier.format(`${EXPORT_DEFAULT} ${prevCode} ${functionCode}, ${afterCode}`, {
      parser: 'babel',
    })
    fse.writeFileSync(this.path, code)
  }

  // 记录当前 source 和之前的 source
  // 对比两者判断是否需要清空用户选择的 api 缓存记录
  recordHash(newSource: string): void {
    this.configData.cli.previousSource = this.configData.client.source
    this.configData.client.source = newSource
  }

  // 是否清空用户选择的 api 缓存记录
  shouldRefreshCache(): boolean {
    return (
      this.configData.cli.previousSource !== this.configData.client.source
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
}

export const rc = new Rc()
