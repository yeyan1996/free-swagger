import inquirer from 'inquirer'
import chalk from 'chalk'
import path from 'path'
import fse from 'fs-extra'
import commander from 'commander'
import { rc } from '../default/rc'
import mockQuestion from './questions/mock'
import serverQuestion from './questions/server'
import { source } from './questions/client'
import { mock, MockConfig, compile } from 'free-swagger'

export function init(cb?: Function): void {
  const packageJsonPath = path.resolve(__dirname, '../../package.json')
  const pkg = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'))

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
      const answer = await inquirer.prompt(mockQuestion)
      await mock((answer as unknown) as MockConfig)
    })
    .option('-c, --config', '以配置项启动 free-swagger', async () => {
      const answer = await inquirer.prompt(serverQuestion)
      rc.recordHash(answer.source)
      await compile(rc.createFreeSwaggerParams())
    })
    // 默认启动
    .action(async (command) => {
      if (!global.__DEV__ && command.rawArgs[2]) return
      const answer: { source: string } = await inquirer.prompt([source])
      rc.recordHash(answer.source)
      await compile(rc.createFreeSwaggerParams())
      cb?.()
      return
    })
    .allowUnknownOption()
    .parse(process.argv)
}
