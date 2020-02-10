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
import { ApiCollection, parsePaths } from "./parse/path";
import { compileInterfaces } from "free-swagger-client";
import { Paths } from "./parse/path";
import { genPaths } from "./gen/path";

// parse swagger json
const parse = async (
  config: Config<OpenAPIV2.Document>
): Promise<{
  paths: Paths;
}> => {
  ensureExist(config.root!, true);
  const paths = parsePaths(config.source.paths);
  return { paths };
};

// code generate
const gen = async (
  config: Required<Config<OpenAPIV2.Document>>,
  dirPath: string,
  paths: Paths
): Promise<void> => {
  // 生成 interface
  if (config.lang === "ts") {
    const interfacePath = path.resolve(dirPath, "interface.ts");
    ensureExist(interfacePath);
    const code = compileInterfaces({
      source: config.source
    });
    await fse.writeFile(interfacePath, code);
  }

  // 生成 api
  const genApi = async ([name, apiCollection]: [
    string,
    ApiCollection
  ]): Promise<void> => {
    const apiCollectionPath = path.resolve(
      dirPath,
      `${camelcase(name)}.${config.lang}`
    );
    ensureExist(apiCollectionPath);
    const code = genPaths(apiCollection, config);
    await fse.writeFile(apiCollectionPath, code);
  };

  Object.entries(paths).forEach(genApi);
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

const normalizeSource = async (
  source: string | OpenAPIV2.Document
): Promise<OpenAPIV2.Document> => {
  if (isUrl(source)) {
    return await fetchJSON(source);
  }
  if (isPath(source)) {
    const sourcePath = path.resolve(process.cwd(), source);
    return JSON.parse(await fse.readFile(sourcePath, "utf-8"));
  }
  return source;
};

// compile = parse + gen
const compile = async (
  config: Required<Config>
): Promise<OpenAPIV2.Document> => {
  const spinner = ora().render();

  config.source = await normalizeSource(config.source);

  if (!isOpenApi2(config)) {
    throw new Error("文档解析错误，请使用 openApi2 规范的文档");
  }
  spinner.start("正在生成 api 文件...");

  ensureExist(config.root, true);

  // parse
  const { paths } = await parse(config);
  spinner.succeed("api 文件解析完成");
  const choosePaths = config.chooseAll
    ? paths
    : pick(paths, ...(await chooseApi(paths)));
  // gen
  await gen(config, config.root, choosePaths);
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

freeSwagger.compile = compile;
module.exports = freeSwagger;

// todo 重新组织代码，结合 free-swagger-client
