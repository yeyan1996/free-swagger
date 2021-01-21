import chalk from 'chalk'
import { isPath, isUrl } from 'free-swagger'
import { rc } from '../../default/rc'

const { configData } = rc

export const source = {
  name: 'source',
  message: `输入 swagger 源(${chalk.magenta('url/path')})`,
  default: rc.configData.client.source,
  validate: (input: string): boolean | string => {
    if (!input) return '请输入 swagger 源'
    if (isUrl(input) || isPath(input)) {
      rc.merge({ source: input })
      rc.save()
      return true
    }
    return '输入的路径不合法或不存在'
  },
}

export const lang = {
  name: 'lang',
  type: 'input',
  message: '选择导出 api 的语言（js/ts）',
  default: configData.client.lang,
  validate: (input: 'js' | 'ts'): boolean | string => {
    if (!['js', 'ts'].includes(input)) return '请输入正确语言 （js/ts）'
    rc.merge({ lang: input })
    rc.save()
    return true
  },
}

export const useJsDoc = {
  name: 'useJsDoc',
  type: 'list',
  message: '是否使用 Js Doc？（y/n）',
  default: configData.client.useJsDoc ? 'y' : 'n',
  when: ({ lang }: any) => lang === 'js',
  validate: (input: any): boolean | string => {
    if (!['y', 'n'].includes(input)) return '请选择结果（y/n）'
    rc.merge({ useJsDoc: input === 'y' })
    rc.save()
    return true
  },
}

export const templateFunction = {
  name: 'templateFunction',
  type: 'editor',
  message: '输入模版函数',
  validate: (input: string, answer: any): boolean => {
    if (!input) return false
    rc.merge(
      answer.lang === 'ts' ? { tsTemplate: input } : { jsTemplate: input }
    )
    rc.merge({ templateFunction: eval(input) })
    rc.save()
    return true
  },
  default: ({ lang }: any): string =>
    lang === 'ts' ? configData.client.tsTemplate : configData.client.jsTemplate,
}
