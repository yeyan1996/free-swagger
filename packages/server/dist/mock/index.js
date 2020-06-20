"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mock = void 0;
const utils_1 = require("../utils");
const main_1 = require("../main");
const path_1 = require("../parse/path");
const path_2 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const camelcase_1 = __importDefault(require("camelcase"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SwaggerParser = require('../libs/json-schema-ref-parser/lib/index');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsf = require('json-schema-faker');
const parsedUrl = (url) => url.replace(/{(.*?)}/g, ':$1');
const SUCCESS_CODE = '200';
jsf.option({
    useExamplesValue: true,
    useDefaultValue: true,
    alwaysFakeOptionals: true,
    refDepthMax: 2,
    maxItems: 1,
    failOnInvalidTypes: false,
});
// 创建状态为 "200" 的模拟数据
const createMockSchema = (schema, key) => {
    let mockSchema = {};
    try {
        mockSchema = jsf.generate(schema);
        console.log(chalk_1.default.green(`${key} 生成成功`));
    }
    catch (e) {
        // todo 环形 json 的处理
        console.log(chalk_1.default.red(`${key} 生成失败,可能存在成环数据，请手动 mock`));
    }
    if (mockSchema.code)
        mockSchema.code = SUCCESS_CODE;
    return mockSchema;
};
exports.mock = async ({ wrap, source, mockRoot, }) => {
    fs_extra_1.default.ensureDirSync(mockRoot);
    const mockCollection = {};
    /**补充缺失的 definitions*/
    Object.assign(source.definitions, {
        List: {
            type: 'array',
        },
    });
    main_1.spinner.start('正在生成 mock 文件...\n');
    const parsedSwagger = await SwaggerParser.dereference(source);
    Object.entries(parsedSwagger.paths).forEach(([path, pathItemObject]) => {
        path_1.methods.forEach(async (method) => {
            var _a, _b, _c;
            const key = `${method.toUpperCase()} ${parsedUrl(path)}`;
            const operationObject = pathItemObject[method];
            if (!operationObject)
                return;
            if (!((_a = operationObject.tags) === null || _a === void 0 ? void 0 : _a[0])) {
                console.log(chalk_1.default.yellow(`${method.toUpperCase()} ${path} 的 tags 不存在,无法生成该 api`));
                return;
            }
            // 含有中文则使用 description 作为文件名
            let controllerName = '';
            if (utils_1.hasChinese(operationObject.tags[0])) {
                const tag = source.tags.find((tag) => tag.name === operationObject.tags[0]);
                if (!tag)
                    return;
                controllerName = tag.description
                    ? utils_1.pascalCase(tag.description)
                    : tag.name;
            }
            else {
                controllerName = utils_1.pascalCase(operationObject.tags[0]);
            }
            if (!mockCollection[controllerName]) {
                mockCollection[controllerName] = {};
            }
            const schema = ((_c = (_b = operationObject.responses) === null || _b === void 0 ? void 0 : _b[SUCCESS_CODE]) === null || _c === void 0 ? void 0 : _c.schema) ? createMockSchema(operationObject.responses[SUCCESS_CODE].schema, key)
                : {
                    code: SUCCESS_CODE,
                    msg: 'xxx',
                    data: {},
                };
            mockCollection[controllerName][key] = wrap
                ? {
                    code: SUCCESS_CODE,
                    msg: 'xxx',
                    data: schema,
                }
                : schema;
        });
    });
    Object.keys(mockCollection).forEach((controllerName) => {
        fs_extra_1.default.writeFileSync(path_2.default.resolve(mockRoot, `${camelcase_1.default(controllerName)}.json`), JSON.stringify(mockCollection[controllerName], null, 2));
    });
    // 将 mock 数据汇总在 mock.js 中导出
    fs_extra_1.default.writeFileSync(path_2.default.resolve(mockRoot, 'mock.js'), `const fs = require("fs");
const path = require("path");
const mock = {};

fs.readdirSync(__dirname)
  .filter(file => file.endsWith(".json"))
  .forEach(file => {
    Object.assign(mock, require(path.resolve(__dirname,file)));
  });

module.exports = mock;
  `);
};
