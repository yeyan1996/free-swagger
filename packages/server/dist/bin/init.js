"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const commander_1 = __importDefault(require("commander"));
const rc_1 = require("../default/rc");
const questions_1 = require("./questions");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const freeSwagger = require('../main');
function init(cb) {
    const packageJsonPath = path_1.default.resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(fs_extra_1.default.readFileSync(packageJsonPath, 'utf-8')); // package.json
    commander_1.default
        .version(pkg.version)
        .usage('')
        .option('-r --reset', '重置为默认配置', () => {
        rc_1.rc.reset();
        console.log(chalk_1.default.green('重置配置项成功'));
    })
        .option('-s --show', '显示当前配置', () => {
        rc_1.rc.show();
    })
        .option('-e --edit', '修改当前配置', () => {
        rc_1.rc.edit();
    })
        .option('-m --mock', '全量生成 mock 数据', async () => {
        const { mockData } = rc_1.rc;
        const answer = await inquirer_1.default.prompt([
            questions_1.source,
            questions_1.cookie,
            {
                name: 'wrap',
                type: 'confirm',
                message: `是否额外包裹一层标准接口返回格式？(${chalk_1.default.magenta(`e.g {code:"200",msg:xxx,data:xxx}`)}) `,
                default: false,
            },
            {
                name: 'mockRoot',
                message: '输入导出 mock 文件的路径',
                default: mockData.mockRoot,
                validate: (input) => !!input || '请输入 mock 文件的路径',
            },
        ]);
        rc_1.rc.merge(answer);
        rc_1.rc.save();
        await freeSwagger.mock(answer);
    })
        .option('-c, --config', '以配置项启动 free-swagger', async () => {
        const { configData } = rc_1.rc;
        // 获取用户回答
        const answer = await inquirer_1.default.prompt([
            questions_1.source,
            questions_1.cookie,
            {
                name: 'root',
                message: '输入导出 api 的根路径',
                default: configData.root,
                validate: (input) => !!input || '请输入 api 根路径',
            },
            {
                name: 'lang',
                type: 'list',
                message: '选择导出 api 的语言',
                default: configData.lang,
                choices: ['ts', 'js'],
            },
            {
                name: 'shouldEditTemplate',
                type: 'list',
                default: 'n',
                choices: ['y', 'n'],
                message: '是否需要编辑模版',
            },
            {
                name: 'templateFunction',
                type: 'editor',
                message: '输入模版函数',
                when: ({ shouldEditTemplate }) => shouldEditTemplate === 'y',
                validate: (input, answer) => {
                    if (!answer)
                        return false;
                    rc_1.rc.merge(answer.lang === 'ts'
                        ? { tsTemplate: input }
                        : { jsTemplate: input });
                    return true;
                },
                default: (answer) => answer.lang === 'ts'
                    ? configData.tsTemplate
                    : configData.jsTemplate,
            },
            {
                name: 'customImportCode',
                message: `输入自定义头语句(${chalk_1.default.magenta('自定义请求库路径')})`,
                default: (answer) => configData.customImportCode ||
                    (answer.lang === 'ts'
                        ? configData.customImportCodeTs
                        : configData.customImportCodeJs),
                validate: (input) => !!input || '请输入默认头语句',
            },
        ]);
        rc_1.rc.merge(answer);
        rc_1.rc.save();
        await freeSwagger.compile(rc_1.rc.getConfig());
    })
        // 默认启动
        .action(async (command) => {
        // @ts-ignore
        if (!global.__DEV__ && command.rawArgs[2])
            return;
        const answer = await inquirer_1.default.prompt([questions_1.source]);
        rc_1.rc.merge(answer);
        rc_1.rc.save();
        await freeSwagger.compile(rc_1.rc.getConfig());
        cb === null || cb === void 0 ? void 0 : cb();
        return;
    })
        .allowUnknownOption()
        .parse(process.argv);
}
exports.init = init;
