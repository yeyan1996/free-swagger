"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const rc_1 = require("./default/rc");
const createChoices = (paths) => {
    const chooseAll = Object.keys(paths).map(name => ({
        name,
        checked: true
    }));
    const apiChoices = rc_1.rc.data.apiChoices;
    if (!apiChoices.length || rc_1.rc.refreshCache())
        return chooseAll;
    // 根据之前的缓存设置选项
    return Object.keys(paths).map(name => {
        const choice = apiChoices.find(choice => choice.name === name);
        const checked = choice ? choice.checked : true;
        return {
            name,
            checked
        };
    });
};
exports.chooseApi = (paths) => __awaiter(void 0, void 0, void 0, function* () {
    const { choosePaths } = yield inquirer_1.default.prompt([
        {
            name: "choosePaths",
            message: "选择需要新生成的 api 集合",
            type: "checkbox",
            pageSize: 20,
            choices: createChoices(paths),
            validate(answer) {
                if (answer.length < 1) {
                    return "至少选择一个 api 集合生成";
                }
                rc_1.rc.merge({
                    apiChoices: Object.keys(paths).map(name => ({
                        name,
                        checked: answer.includes(name)
                    }))
                });
                rc_1.rc.save();
                return true;
            }
        }
    ]);
    return choosePaths;
});
