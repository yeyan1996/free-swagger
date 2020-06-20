import chalk from 'chalk'
import { isPath, isUrl } from '../utils'
import { rc } from '../default/rc'

export const source = {
  name: 'source',
  message: `输入 swagger 源(${chalk.magenta('url/path')})`,
  default: rc.configData.source,
  validate: (input: string): boolean | string => {
    if (!input) return '请输入 swagger 源'
    if (isUrl(input) || isPath(input)) {
      return true
    }
    return '输入的路径不合法或不存在'
  },
}

export const cookie = {
  name: 'cookie',
  message: `输入用于鉴权的cookie(${chalk.magenta(
    'swagger源不需要鉴权则置空 e.g SESSION=xxx'
  )})`,
  when: ({ source }: any): boolean => isUrl(source!),
  default: rc.configData.cookie,
}
