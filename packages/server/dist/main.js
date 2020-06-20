"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = void 0;
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
const mock_1 = require("./mock");
exports.spinner = ora_1.default().render();
// parse swagger json
const parse = async (config) => {
    fs_extra_1.default.ensureDirSync(config.root);
    const paths = path_2.parsePaths(config.source);
    return { paths };
};
// code generate
const gen = async (config, dirPath, paths) => {
    // 生成 interface
    if (config.lang === 'ts') {
        const interfacePath = path_1.default.resolve(dirPath, 'interface.ts');
        fs_extra_1.default.ensureFileSync(interfacePath);
        const code = free_swagger_client_1.compileInterfaces(config.source);
        await fs_extra_1.default.writeFile(interfacePath, code);
    }
    // 生成 api
    const genApi = async ([name, apiCollection]) => {
        const apiCollectionPath = path_1.default.resolve(dirPath, `${camelcase_1.default(name)}.${config.lang}`);
        fs_extra_1.default.ensureFileSync(apiCollectionPath);
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
        return JSON.parse(await fs_extra_1.default.readFile(sourcePath, 'utf-8'));
    }
    return source;
};
// compile = parse + gen
const compile = async (config) => {
    try {
        config.source = await normalizeSource(config.source, config.cookie);
        if (!utils_1.assertOpenApi2(config)) {
            throw new Error('文档解析错误，请使用 openApi2 规范的文档');
        }
        exports.spinner.start('正在生成 api 文件...');
        fs_extra_1.default.ensureDirSync(config.root);
        // parse
        const { paths } = await parse(config);
        exports.spinner.succeed('api 文件解析完成');
        const choosePaths = config.chooseAll || global.__DEV__
            ? paths
            : lodash_1.pick(paths, ...(await inquirer_1.chooseApi(paths)));
        // gen
        await gen(config, config.root, choosePaths);
        exports.spinner.succeed(`api 文件生成成功，文件根目录地址: ${chalk_1.default.green(config.root)}`);
        return config.source;
    }
    catch (e) {
        exports.spinner.fail(`${chalk_1.default.red('api 文件生成失败')}`);
        throw new Error(e);
    }
};
// freeSwagger = merge + compile
const freeSwagger = async (config) => {
    const mergedConfig = await default_1.mergeDefaultConfig(config);
    return await compile(mergedConfig);
};
freeSwagger.compile = compile;
freeSwagger.mock = async (config) => {
    const mergedConfig = default_1.mergeDefaultMockConfig(config);
    const source = await normalizeSource(mergedConfig.source, mergedConfig.cookie);
    await mock_1.mock({ ...mergedConfig, source });
    exports.spinner.succeed(`mock 文件生成成功，文件根目录地址: ${chalk_1.default.green(path_1.default.resolve(mergedConfig.mockRoot))}`);
};
module.exports = freeSwagger;
// todo 重新组织代码，结合 free-swagger-client
// todo 添加开源商标
