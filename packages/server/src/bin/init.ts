import inquirer from 'inquirer'
import chalk from 'chalk'
import path from 'path'
import fse from 'fs-extra'
import commander from 'commander'
import { ConfigAnswer, rc } from '../default/rc'
import { cookie, source } from './questions'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const freeSwagger = require('../main')

export function init(cb?: Function): void {
  const packageJsonPath = path.resolve(__dirname, '../../package.json')
  const pkg = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8')) // package.json

  commander
    .version(pkg.version)
    .usage('')
    .option('-r --reset', '重置为默认配置', () => {
      rc.reset()
      console.log(chalk.green('重置配置项成功'))
    })
    .option('-s --show', '显示当前配置', () => {
      rc.show()
    })
    .option('-e --edit', '修改当前配置', () => {
      rc.edit()
    })
    .option('-m --mock', '全量生成 mock 数据', async () => {
      const { mockData } = rc
      const answer = await inquirer.prompt([
        source,
        cookie,
        {
          name: 'wrap',
          type: 'confirm',
          message: `是否额外包裹一层标准接口返回格式？(${chalk.magenta(
            `e.g {code:"200",msg:xxx,data:xxx}`
          )}) `,
          default: false,
        },
        {
          name: 'mockRoot',
          message: '输入导出 mock 文件的路径',
          default: mockData.mockRoot,
          validate: (input): boolean | string =>
            !!input || '请输入 mock 文件的路径',
        },
      ])
      rc.merge(answer)
      rc.save()
      await freeSwagger.mock(answer)
    })
    .option('-c, --config', '以配置项启动 free-swagger', async () => {
      const { configData } = rc
      // 获取用户回答
      const answer: Omit<
        ConfigAnswer,
        'tsTemplate' | 'jsTemplate'
      > = await inquirer.prompt([
        source,
        cookie,
        {
          name: 'root',
          message: '输入导出 api 的根路径',
          default: configData.root,
          validate: (input): boolean | string => !!input || '请输入 api 根路径',
        },

        {
          name: 'lang',
          type: 'list',
          message: '选择导出 api 的语言',
          default: configData.lang,
          choices: ['ts', 'js'],
        },
        {
          name: 'useJsDoc',
          type: 'confirm',
          message: '是否使用 jsDoc',
          default: true,
          when: ({ lang }) => lang === 'js',
        },
        {
          name: 'shouldEditTemplate',
          type: 'confirm',
          default: false,
          message: '是否需要编辑模版',
        },
        {
          name: 'templateFunction',
          type: 'editor',
          message: '输入模版函数',
          when: ({ shouldEditTemplate }): boolean =>
            shouldEditTemplate === 'n' ? false : shouldEditTemplate,
          validate: (input, answer): boolean => {
            if (!answer) return false
            rc.merge(
              answer.lang === 'ts'
                ? { tsTemplate: input }
                : { jsTemplate: input }
            )
            return true
          },
          default: (answer: ConfigAnswer): string =>
            answer.lang === 'ts'
              ? configData.tsTemplate
              : configData.jsTemplate,
        },
        {
          name: 'customImportCode',
          message: `输入自定义头语句(${chalk.magenta('自定义请求库路径')})`,
          default: (answer: ConfigAnswer): string =>
            configData.customImportCode ||
            (answer.lang === 'ts'
              ? configData.customImportCodeTs
              : configData.customImportCodeJs),
          validate: (input): boolean | string => !!input || '请输入默认头语句',
        },
      ])
      rc.merge(answer)
      rc.save()
      await freeSwagger.compile(rc.getConfig())
    })
    // 默认启动
    .action(async (command) => {
      // @ts-ignore
      if (!global.__DEV__ && command.rawArgs[2]) return
      const answer: { source: string } = await inquirer.prompt([source])
      rc.merge(answer)
      rc.save()
      await freeSwagger.compile(rc.getConfig())
      cb?.()
      return
    })
    .allowUnknownOption()
    .parse(process.argv)
}
