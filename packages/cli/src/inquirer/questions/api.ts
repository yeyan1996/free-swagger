import chalk from 'chalk'
import { lang, source, templateFunction, typeOnly } from './core'
import { rc, RcConfig } from '../../default/rc'
import { ParsedPathsObject } from 'free-swagger'
import { prompt } from '../index'
import { isUrl } from 'free-swagger'
import path from 'path'

const createChoices = (
  paths: ParsedPathsObject
): RcConfig['api']['apiChoices'] => {
  const chooseAllChoices = Object.keys(paths).map((name) => ({
    name,
    checked: true,
  }))
  const apiChoices = rc.configData.api.apiChoices
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

export const chooseApi = async (
  paths: ParsedPathsObject
): Promise<string[]> => {
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
          'api'
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
  default: rc.configData.api.cookie,
  callback: (input: string) => {
    rc.merge({ cookie: input }, 'api')
    rc.save()
  },
}

export const root = {
  name: 'root',
  message: '输入导出 api 的根目录',
  default: rc.configData.api.root || path.resolve(process.cwd(), 'src/api'),
  validate: (input: string): boolean | string => {
    if (!input) {
      return '请输入导出 api 的根目录'
    } else {
      return true
    }
  },
  callback: (input: string) => {
    rc.merge({ root: input }, 'api')
    rc.save()
  },
}
export default [
  source,
  cookie,
  root,
  lang,
  typeOnly,
  {
    name: 'shouldEditTemplate',
    type: 'confirm',
    default: false,
    message: '是否需要编辑模版？',
    when: ({ typeOnly }: any): boolean => typeOnly === false,
  },
  {
    ...templateFunction,
    when: ({ shouldEditTemplate, typeOnly }: any): boolean =>
      shouldEditTemplate && typeOnly === false,
  },
  {
    name: 'header',
    message: `输入自定义头语句(${chalk.magenta('自定义请求库路径')})`,
    when: ({ typeOnly }: any): boolean => typeOnly === false,
    default: ({ lang }: any): string =>
      lang === 'ts' ? rc.configData.api.headerTs : rc.configData.api.headerJs,
    callback: (input: string, { lang }: any) => {
      rc.merge({ header: input }, 'api')
      if (lang === 'ts') {
        rc.merge({ headerTs: input }, 'api')
      } else {
        rc.merge({ headerJs: input }, 'api')
      }
      rc.save()
    },
  },
]
