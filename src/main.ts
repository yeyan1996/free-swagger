import fse from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import camelcase from "camelcase";
import axios from "axios";
import { OpenAPIV2 } from "openapi-types";
import { ensureExist, Config, isUrl, isPath, isOpenApi2 } from "./utils";
import { mergeDefaultConfig } from "./default";
import { chooseApi } from "./inquirer";
import { pick } from "lodash";
import { parsePaths, parsePath, Paths } from "./parse/path";
import { InterfaceCollection, parseInterfaces } from "./parse/interface";
import { genInterfaces } from "./gen/interface";
import { genPaths, genPath } from "./gen/path";
// import { Change } from "diff";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const diff = require("diff");

// parse swagger json
const parse = async (
  config: Config<OpenAPIV2.Document>
): Promise<{
  paths: Paths;
  interfaces: InterfaceCollection;
}> => {
  await ensureExist(config.root!, true);
  const paths = parsePaths(config.source.paths);
  const interfaces = parseInterfaces(config.source.definitions);

  return { paths, interfaces };
};

// code generate
const gen = async (
  config: Required<Config<OpenAPIV2.Document>>,
  dirPath: string,
  paths: Paths,
  interfaces: InterfaceCollection
): Promise<void> => {
  // 生成 interface
  if (config.lang === "ts") {
    let code = "// @ts-nocheck \n/* eslint-disable */\n";
    const interfacePath = path.resolve(dirPath, "interface.ts");
    await ensureExist(interfacePath);
    code += genInterfaces(interfaces);
    await fse.writeFile(interfacePath, code);
  }

  // const diffObj: any = {};

  // 生成 api
  Object.entries(paths).forEach(async ([name, apiCollection]) => {
    const apiCollectionPath = path.resolve(
      dirPath,
      `${camelcase(name)}.${config.lang}`
    );
    await ensureExist(apiCollectionPath);
    const code = genPaths(apiCollection, config);
    // todo diff
    // const previousCode = await fse.readFile(apiCollectionPath, "utf-8");
    // diffObj[name] = diff
    //   .diffChars(previousCode, code)
    //   .filter((part: Change) => part.added || part.removed);
    await fse.writeFile(apiCollectionPath, code);
    // return diffObj;
  });
};

const fetchJSON = async (url: string): Promise<OpenAPIV2.Document> => {
  const spinner = ora().render();
  spinner.start(`正在发送请求到: ${url}`);
  try {
    const { data } = await axios.get(url);
    spinner.succeed("请求结束");
    return data;
  } catch (e) {
    spinner.fail("请求失败");
    throw new Error(e);
  }
};

// compile = parse + gen
export const compile = async (
  config: Required<Config>
): Promise<OpenAPIV2.Document> => {
  const spinner = ora().render();

  if (isUrl(config.source)) {
    config.source = await fetchJSON(config.source);
  }
  if (isPath(config.source)) {
    const sourcePath = path.resolve(process.cwd(), config.source);
    config.source = JSON.parse(await fse.readFile(sourcePath, "utf-8"));
  }
  if (!isOpenApi2(config)) {
    throw new Error(
      "free-swagger 暂时不支持 openApi3 规范，请使用 openApi2 规范的文档"
    );
  }
  spinner.start("正在生成 api 文件...");

  await ensureExist(config.root, true);

  // parse
  const { paths, interfaces } = await parse(config);
  spinner.succeed("api 文件解析完成");

  const choosePaths = config.chooseAll
    ? paths
    : pick(paths, ...(await chooseApi(paths)));
  // gen
  await gen(config, config.root, choosePaths, interfaces);
  spinner.succeed(
    `api 文件生成成功，文件根目录地址: ${chalk.green(config.root)}`
  );
  return config.source;
};

// freeSwagger = merge + compile
const freeSwagger = async (
  config: Config | string
): Promise<OpenAPIV2.Document> => {
  const spinner = ora().render();
  try {
    const mergedConfig = await mergeDefaultConfig(config);
    return await compile(mergedConfig);
  } catch (e) {
    spinner.fail(`${chalk.red("api 文件生成失败")}`);
    throw new Error(e);
  }
};

module.exports = freeSwagger;
exports.parsePath = parsePath;
exports.genPath = genPath;
