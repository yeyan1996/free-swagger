import chalk from 'chalk'
import { isUrl, isPath } from 'free-swagger'
import { rc } from '../../default/rc'

export const source = {
  name: 'source',
  message: `输入 swagger 源(${chalk.magenta('url/path')})`,
  default: rc.configData.client.source,
  validate: (input: string): boolean | string => {
    if (!input) return '请输入 swagger 源'
    if (isUrl(input) || isPath(input)) {
      return true
    }
    return '输入的路径不合法或不存在'
  },
  callback: (input: string) => {
    rc.merge(isUrl(input) ? { source: input, _url: input } : { source: input })
    rc.recordHash(input)
    rc.save()
  },
}

export const lang = {
  name: 'lang',
  type: 'list',
  message: '选择导出 api 的语言',
  default: rc.configData.client.lang,
  choices: ['js', 'ts'],
  callback: (input: string) => {
    rc.merge({
      lang: input,
    })
    rc.merge({
      templateFunction: eval(
        input === 'ts'
          ? rc.configData.client.tsTemplate
          : rc.configData.client.jsTemplate
      ),
    })
    rc.save()
  },
}

export const templateFunction = {
  name: 'templateFunction',
  type: 'editor',
  message: '输入模版函数',
  default: ({ lang }: any): string =>
    lang === 'ts'
      ? rc.configData.client.tsTemplate
      : rc.configData.client.jsTemplate,
  validate: (input: string) => {
    if (!input) return '请输入模版函数'
    return true
  },
  callback: (input: string, { lang }: any) => {
    rc.merge(lang === 'ts' ? { tsTemplate: input } : { jsTemplate: input })
    rc.merge({ templateFunction: eval(input) })
    rc.save()
  },
}
