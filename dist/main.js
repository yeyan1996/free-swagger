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
const utils_1 = require("./utils");
const default_1 = require("./default");
const inquirer_1 = require("./inquirer");
const lodash_1 = require("lodash");
const path_2 = require("./parse/path");
const free_swagger_client_1 = require("free-swagger-client");
const path_3 = require("./gen/path");
const request_1 = require("./request");
const spinner = ora_1.default().render();
// parse swagger json
const parse = async (config) => {
    utils_1.ensureExist(config.root, true);
    const paths = path_2.parsePaths(config.source.paths);
    return { paths };
};
// code generate
const gen = async (config, dirPath, paths) => {
    // 生成 interface
    if (config.lang === "ts") {
        const interfacePath = path_1.default.resolve(dirPath, "interface.ts");
        utils_1.ensureExist(interfacePath);
        const code = free_swagger_client_1.compileInterfaces(config.source);
        await fs_extra_1.default.writeFile(interfacePath, code);
    }
    // 生成 api
    const genApi = async ([name, apiCollection]) => {
        const apiCollectionPath = path_1.default.resolve(dirPath, `${camelcase_1.default(name)}.${config.lang}`);
        utils_1.ensureExist(apiCollectionPath);
        const code = path_3.genPaths(apiCollection, config);
        await fs_extra_1.default.writeFile(apiCollectionPath, code);
    };
    Object.entries(paths).forEach(genApi);
};
const normalizeSource = async (source, cookie) => {
    if (utils_1.isUrl(source)) {
        return await request_1.fetchJSON(source, cookie);
    }
    if (utils_1.isPath(source)) {
        const sourcePath = path_1.default.resolve(process.cwd(), source);
        return JSON.parse(await fs_extra_1.default.readFile(sourcePath, "utf-8"));
    }
    return source;
};
// compile = parse + gen
const compile = async (config) => {
    try {
        config.source = await normalizeSource(config.source, config.cookie);
        if (!utils_1.assertOpenApi2(config)) {
            throw new Error("文档解析错误，请使用 openApi2 规范的文档");
        }
        spinner.start("正在生成 api 文件...");
        utils_1.ensureExist(config.root, true);
        // parse
        const { paths } = await parse(config);
        spinner.succeed("api 文件解析完成");
        const choosePaths = config.chooseAll
            ? paths
            : lodash_1.pick(paths, ...(await inquirer_1.chooseApi(paths)));
        // gen
        await gen(config, config.root, choosePaths);
        spinner.succeed(`api 文件生成成功，文件根目录地址: ${chalk_1.default.green(config.root)}`);
        return config.source;
    }
    catch (e) {
        console.log(e);
        spinner.fail(`${chalk_1.default.red("api 文件生成失败")}`);
    }
};
// freeSwagger = merge + compile
const freeSwagger = async (config) => {
    const mergedConfig = await default_1.mergeDefaultConfig(config);
    return await compile(mergedConfig);
};
freeSwagger.compile = compile;
module.exports = freeSwagger;
// todo 重新组织代码，结合 free-swagger-client
// todo 添加开源商标
