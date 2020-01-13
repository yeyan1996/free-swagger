"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const camelcase_1 = __importDefault(require("camelcase"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const default_1 = require("./default");
const inquirer_1 = require("./inquirer");
const lodash_1 = require("lodash");
const path_2 = require("./parse/path");
const interface_1 = require("./parse/interface");
const interface_2 = require("./gen/interface");
const path_3 = require("./gen/path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const diff = require("diff");
// parse swagger json
const parse = async (config) => {
    await utils_1.ensureExist(config.root, true);
    const paths = path_2.parsePaths(config.source.paths);
    const interfaces = interface_1.parseInterfaces(config.source.definitions);
    return { paths, interfaces };
};
// code generate
const gen = async (config, dirPath, paths, interfaces) => {
    // 生成 interface
    if (config.lang === "ts") {
        let code = "// @ts-nocheck \n/* eslint-disable */\n";
        const interfacePath = path_1.default.resolve(dirPath, "interface.ts");
        await utils_1.ensureExist(interfacePath);
        code += interface_2.genInterfaces(interfaces);
        await fs_extra_1.default.writeFile(interfacePath, code);
    }
    const diffObj = {};
    // 生成 api
    Object.entries(paths).forEach(async ([name, apiCollection]) => {
        const apiCollectionPath = path_1.default.resolve(dirPath, `${camelcase_1.default(name)}.${config.lang}`);
        await utils_1.ensureExist(apiCollectionPath);
        const code = path_3.genPaths(apiCollection, config);
        // todo diff
        const previousCode = await fs_extra_1.default.readFile(apiCollectionPath, "utf-8");
        diffObj[name] = diff
            .diffChars(previousCode, code)
            .filter((part) => part.added || part.removed);
        await fs_extra_1.default.writeFile(apiCollectionPath, code);
        return diffObj;
    });
};
const fetchJSON = async (url) => {
    const spinner = ora_1.default().render();
    spinner.start(`正在发送请求到: ${url}`);
    try {
        const { data } = await axios_1.default.get(url);
        spinner.succeed("请求结束");
        return data;
    }
    catch (e) {
        spinner.fail("请求失败");
        throw new Error(e);
    }
};
// compile = parse + gen
exports.compile = async (config) => {
    const spinner = ora_1.default().render();
    if (utils_1.isUrl(config.source)) {
        config.source = await fetchJSON(config.source);
    }
    if (utils_1.isPath(config.source)) {
        const sourcePath = path_1.default.resolve(process.cwd(), config.source);
        config.source = JSON.parse(await fs_extra_1.default.readFile(sourcePath, "utf-8"));
    }
    if (!utils_1.isOpenApi2(config)) {
        throw new Error("free-swagger 暂时不支持 openApi3 规范，请使用 openApi2 规范的文档");
    }
    spinner.start("正在生成 api 文件...");
    await utils_1.ensureExist(config.root, true);
    // parse
    const { paths, interfaces } = await parse(config);
    spinner.succeed("api 文件解析完成");
    const choosePaths = config.chooseAll
        ? paths
        : lodash_1.pick(paths, ...(await inquirer_1.chooseApi(paths)));
    // gen
    await gen(config, config.root, choosePaths, interfaces);
    spinner.succeed(`api 文件生成成功，文件根目录地址: ${chalk_1.default.green(config.root)}`);
    return config.source;
};
// freeSwagger = merge + compile
const freeSwagger = async (config) => {
    const spinner = ora_1.default().render();
    try {
        const mergedConfig = await default_1.mergeDefaultConfig(config);
        return await exports.compile(mergedConfig);
    }
    catch (e) {
        spinner.fail(`${chalk_1.default.red("api 文件生成失败")}`);
        throw new Error(e);
    }
};
exports.default = freeSwagger;
