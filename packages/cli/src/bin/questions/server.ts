import chalk from 'chalk'
import { lang, source, templateFunction, useJsDoc } from './client'
import {
  rc,
  // RcConfig
} from '../../default/rc'
// import { ParsedPaths } from '../../parse/path'
// import inquirer from 'inquirer'
import { isUrl } from 'free-swagger'
// import fse from 'fs-extra'

const { configData } = rc

// const createChoices = (
//   paths: ParsedPaths
// ): RcConfig['cli']['apiChoices'] => {
//   const chooseAll = Object.keys(paths).map((name) => ({
//     name,
//     checked: true,
//   }))
//   const apiChoices = rc.configData.cli.apiChoices
//   if (!apiChoices.length || rc.shouldRefreshCache()) return chooseAll
//
//   // 根据之前的缓存设置选项
//   return Object.keys(paths).map((name) => {
//     const choice = apiChoices.find((choice) => choice.name === name)
//     const checked = choice ? choice.checked : true
//     return {
//       name,
//       checked,
//     }
//   })
// }

// export const chooseApi = async (paths: ParsedPaths): Promise<string[]> => {
//   const { choosePaths } = await inquirer.prompt([
//     {
//       name: 'choosePaths',
//       message: '选择需要新生成的 api 文件',
//       type: 'checkbox',
//       pageSize: 20,
//       choices: createChoices(paths),
//       validate(answer): boolean | string {
//         if (answer.length < 1) {
//           return '至少选择一个 api 文件生成'
//         }
//         rc.merge(
//           {
//             apiChoices: Object.keys(paths).map((name) => ({
//               name,
//               checked: answer.includes(name),
//             })),
//           },
//           'cli'
//         )
//         rc.save()
//         return true
//       },
//     },
//   ])
//   return choosePaths
// }

export const cookie = {
  name: 'cookie',
  message: `输入用于鉴权的cookie(${chalk.magenta(
    'swagger源不需要鉴权则置空 e.g SESSION=xxx'
  )})`,
  when: ({ source }: any): boolean => isUrl(source!),
  validate: (input: string): boolean => {
    rc.merge({ cookie: input }, 'cli')
    rc.save()
    return true
  },
  default: rc.configData.cli.cookie,
}

export const root = {
  name: 'root',
  message: '输入导出 api 的根目录',
  default: configData.cli.root,
  validate: (input: string): boolean | string => {
    if (!input) {
      return '请输入导出 api 的根目录'
    } else {
      rc.merge({ root: input }, 'cli')
      rc.save()
      return true
    }
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
    type: 'input',
    default: 'n',
    message: '是否需要编辑模版？(y/n)',
    validate: (input: string, answers: any): boolean | string => {
      if (!['y', 'n'].includes(input)) return '请选择结果（y/n）'
      if (input === 'n') {
        const { jsTemplate, tsTemplate } = rc.configData.client
        rc.merge({
          templateFunction:
            answers.lang === 'js' ? eval(jsTemplate) : eval(tsTemplate),
        })
        rc.save()
      }
      return true
    },
  },
  {
    ...templateFunction,
    when: ({ shouldEditTemplate }: any): boolean =>
      shouldEditTemplate === 'n' ? false : shouldEditTemplate,
  },
  {
    name: 'customImportCode',
    message: `输入自定义头语句(${chalk.magenta('自定义请求库路径')})`,
    default: ({ lang }: any): string =>
      configData.cli.customImportCode ||
      (lang === 'ts'
        ? configData.cli.customImportCodeTs
        : configData.cli.customImportCodeJs),
    validate: (input: string): boolean | string => {
      if (!input) {
        return '请输入自定义头语句'
      } else {
        rc.merge({ customImportCode: input }, 'cli')
        rc.save()
        return true
      }
    },
  },
]
