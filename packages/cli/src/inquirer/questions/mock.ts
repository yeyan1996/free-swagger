import chalk from 'chalk'
import { source } from './client'
import { cookie } from './server'
import { rc } from '../../default/rc'

export default [
  source,
  cookie,
  {
    name: 'mockRoot',
    message: '输入导出 mock 文件的目录',
    default: rc.configData.mock.mockRoot,
    validate: (input: string): boolean | string => {
      if (!input) {
        return '请输入导出 mock 文件的目录'
      } else {
        return true
      }
    },
    callback: (input: string) => {
      rc.merge({ mockRoot: input }, 'mock')
      rc.save()
    },
  },
  {
    name: 'wrap',
    type: 'confirm',
    message: `是否额外包裹一层标准接口返回格式？(${chalk.magenta(
      `e.g {code:"200",msg:xxx,data:xxx}`
    )})`,
    default: rc.configData.mock.wrap,
    callback: (input: boolean) => {
      rc.merge({ wrap: input }, 'mock')
      rc.save()
    },
  },
]
