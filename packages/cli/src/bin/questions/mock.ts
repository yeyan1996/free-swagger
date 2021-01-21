import chalk from 'chalk'
import { source } from './client'
import { cookie } from './server'
import { rc } from '../../default/rc'
// import fse from 'fs-extra'

const { configData } = rc

export default [
  source,
  cookie,
  {
    name: 'mockRoot',
    message: '输入导出 mock 文件的目录',
    default: configData.mock.mockRoot,
    validate: (input: string): boolean | string => {
      if (!input) {
        return '请输入导出 mock 文件的目录'
      } else {
        rc.merge({ mockRoot: input }, 'mock')
        rc.save()
        return true
      }
    },
  },
  // {
  //   name: 'overwriteDirectory',
  //   type: 'confirm',
  //   default: false,
  //   when: ({ mockRoot }: any): boolean => fse.existsSync(root),
  //   message: ({ mockRoot }: any) => `${root} 目录已存在，是否覆盖？`,
  // },
  {
    name: 'wrap',
    type: 'list',
    choices: ['Y', 'N'],
    message: `是否额外包裹一层标准接口返回格式？(${chalk.magenta(
      `e.g {code:"200",msg:xxx,data:xxx}`
    )}) `,
    default: configData.mock.wrap,
    validate: (input: string): boolean => {
      rc.merge({ wrap: input }, 'mock')
      rc.save()
      return true
    },
  },
]
