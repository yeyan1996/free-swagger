import chalk from 'chalk'
import { lang, source, templateFunction, useJsDoc } from './client'
import { rc, RcConfig } from '../../default/rc'
import { ParsedPaths } from 'free-swagger'
import { prompt } from '../index'
import { isUrl } from 'free-swagger'
// import fse from 'fs-extra'

const createChoices = (
  paths: ParsedPaths
): RcConfig['server']['apiChoices'] => {
  const chooseAllChoices = Object.keys(paths).map((name) => ({
    name,
    checked: true,
  }))
  const apiChoices = rc.configData.server.apiChoices
  if (!apiChoices.length || rc.shouldRefreshCache()) return chooseAllChoices

  // 根据之前的缓存设置选项
  return Object.keys(paths).map((name) => {
    const choice = apiChoices.find((choice) => choice.name === name)
    const checked = choice ? choice.checked : true
    return {
      name,
      checked,
    }
  })
}

export const chooseApi = async (paths: ParsedPaths): Promise<string[]> => {
  const { choosePaths } = await prompt([
    {
      name: 'choosePaths',
      message: '选择需要新生成的 api 文件',
      type: 'checkbox',
      pageSize: 20,
      choices: createChoices(paths),
      validate(answer: string[]): boolean | string {
        if (answer.length < 1) {
          return '至少选择一个 api 文件生成'
        }
        return true
      },
      callback: (input: any[]) => {
        rc.merge(
          {
            apiChoices: Object.keys(paths).map((name) => ({
              name,
              checked: input.includes(name),
            })),
          },
          'server'
        )
        rc.save()
      },
    },
  ])
  return choosePaths
}

export const cookie = {
  name: 'cookie',
  message: `输入用于鉴权的cookie(${chalk.magenta(
    'swagger源不需要鉴权则置空 e.g SESSION=xxx'
  )})`,
  when: ({ source }: any): boolean => isUrl(source!),
  default: rc.configData.server.cookie,
  callback: (input: string) => {
    rc.merge({ cookie: input }, 'server')
    rc.save()
  },
}

export const root = {
  name: 'root',
  message: '输入导出 api 的根目录',
  default: rc.configData.server.root,
  validate: (input: string): boolean | string => {
    if (!input) {
      return '请输入导出 api 的根目录'
    } else {
      return true
    }
  },
  callback: (input: string) => {
    rc.merge({ root: input }, 'server')
    rc.save()
  },
}
export default [
  source,
  cookie,
  root,
  // {
  //   name: 'overwriteDirectory',
  //   type: 'confirm',
  //   default: false,
  //   when: ({ root }: any): boolean => fse.existsSync(root),
  //   message: ({ root }: any) => `${root} 目录已存在，是否覆盖？`,
  // },
  lang,
  useJsDoc,
  {
    name: 'shouldEditTemplate',
    type: 'confirm',
    default: false,
    message: '是否需要编辑模版？',
  },
  {
    ...templateFunction,
    when: ({ shouldEditTemplate }: any): boolean => shouldEditTemplate,
  },
  {
    name: 'customImportCode',
    message: `输入自定义头语句(${chalk.magenta('自定义请求库路径')})`,
    default: ({ lang }: any): string =>
      lang === 'ts'
        ? rc.configData.server.customImportCodeTs
        : rc.configData.server.customImportCodeJs,
    validate: (input: string): boolean | string => {
      if (!input) {
        return '请输入自定义头语句'
      } else {
        return true
      }
    },
    callback: (input: string, { lang }: any) => {
      rc.merge({ customImportCode: input }, 'server')
      if (lang === 'ts') {
        rc.merge({ customImportCodeTs: input }, 'server')
      } else {
        rc.merge({ customImportCodeJs: input }, 'server')
      }
      rc.save()
    },
  },
]
