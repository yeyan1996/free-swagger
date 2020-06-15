"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseApi = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const rc_1 = require("./default/rc");
const createChoices = (paths) => {
    const chooseAll = Object.keys(paths).map((name) => ({
        name,
        checked: true,
    }));
    const apiChoices = rc_1.rc.configData.apiChoices;
    if (!apiChoices.length || rc_1.rc.shouldRefreshCache())
        return chooseAll;
    // 根据之前的缓存设置选项
    return Object.keys(paths).map((name) => {
        const choice = apiChoices.find((choice) => choice.name === name);
        const checked = choice ? choice.checked : true;
        return {
            name,
            checked,
        };
    });
};
exports.chooseApi = async (paths) => {
    const { choosePaths } = await inquirer_1.default.prompt([
        {
            name: 'choosePaths',
            message: '选择需要新生成的 api 文件',
            type: 'checkbox',
            pageSize: 20,
            choices: createChoices(paths),
            validate(answer) {
                if (answer.length < 1) {
                    return '至少选择一个 api 文件生成';
                }
                rc_1.rc.merge({
                    apiChoices: Object.keys(paths).map((name) => ({
                        name,
                        checked: answer.includes(name),
                    })),
                });
                rc_1.rc.save();
                return true;
            },
        },
    ]);
    return choosePaths;
};
