import path from "path";
import fs from "fs";
import freeSwagger from "../src/main";

const assertFiles = async (dirPath, apiFilesList,exactlyEqual = true) => {
  const filesPath = fs.readdirSync(dirPath);
  // 只要文件夹中包含改文件名就可以，不需要完全相符
  if(exactlyEqual){
    apiFilesList.forEach(filePath => {
      expect(filesPath.includes(filePath)).toBe(true);
    })
  }else{
    expect(filesPath).toEqual(apiFilesList);
  }
  filesPath.forEach(filename => {
    if(filename === 'interface'){
      const file = fs.readFileSync(path.resolve(dirPath, filename,'index.ts'), "utf-8");
      expect(file).toMatchSnapshot();
      return
    }
    if(filename === 'typedef'){
      const file = fs.readFileSync(path.resolve(dirPath, filename,'index.js'), "utf-8");
      expect(file).toMatchSnapshot();
      return
    }
    const file = fs.readFileSync(path.resolve(dirPath, filename), "utf-8");
    expect(file).toMatchSnapshot();
  });
};

describe("api test", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1482363367071);
    global.__DEV__ = true
  });

  test("base option", async () => {
    const dirname = "swaggerPetstore";
    const dirPath = path.resolve(__dirname, "api", dirname);
    await freeSwagger({
      source: require(`./json/${dirname}`),
      root: dirPath,
    });
    await assertFiles(dirPath, ["pet.js", "store.js", "user.js"]);
  });

  test("simple jsdoc", async () => {
    const dirname = "swaggerPetstore";
    const dirPath = path.resolve(__dirname, "api",dirname + "1");
    await freeSwagger({
      source: require(`./json/${dirname}`),
      root: dirPath,
      jsDoc:true
    });
    await assertFiles(dirPath, ["pet.js", "store.js","typedef", "user.js"]);
  });

  test("ts language", async () => {
    const dirname = "uberApi";
    const dirPath = path.resolve(__dirname, "api", dirname);
    await freeSwagger({
      source: require(`./json/${dirname}`),
      lang: "ts",
      root: dirPath,
    });
    await assertFiles(dirPath, [
      "auditLog.ts",
      "device.ts",
      "interface",
      "mappers.ts",
      "ymTicketTypical.ts"
    ]);
  });

  test("custom ts template", async () => {
    const dirname = "homeIotApi";
    const dirPath = path.resolve(__dirname, "api",  dirname);

    await freeSwagger({
      source: require(`./json/${dirname}`),
      root: dirPath,
      lang: "ts",
      header: `import { AxiosResponse } from 'axios'
import http from 'http'
`,
    });

    await assertFiles(dirPath, [
      "device.ts",
      "environment.ts",
      "interface",
      "zWave.ts",
      "zones.ts"
    ]);
  });

  test("should work with only one string params", async () => {
    global.__PATH__ = path.resolve(__dirname, "api/defaultString")
    const dirname = "swaggerPetstore1";
    await freeSwagger(path.resolve(__dirname, "json", `${dirname}.json`));
    await assertFiles(
        global.__PATH__ ,
        ["pet.js", "store.js", "user.js"],
        true
    );
    global.__PATH__ = ''
  });

  test("error params", async () => {
    try {
      await freeSwagger("/a/b/c")
    } catch (e) {
      expect(e.message).toBe("swagger 文档不规范，请检查参数格式")
    }
  });

  test("should work in openApi3", async () => {
    const dirPath = path.resolve(__dirname, `api`,'openApi3')
    await freeSwagger({source: path.resolve(__dirname, "json", 'openApi3'),root: dirPath });
    await assertFiles(dirPath, [
      "device.js",
      "environment.js",
      "zones.js",
      "zWave.js"
    ]);
  });

  test("should work with only one json params", async () => {
    global.__PATH__ = path.resolve(__dirname, "api/defaultJson")
    const dirname = "uberApi1";
    await freeSwagger(require(path.resolve(__dirname, "json", `${dirname}.json`)));
    await assertFiles(global.__PATH__, [
      "auditLog.js",
      "device.js",
      "mappers.js",
      "ymTicketTypical.js"
    ],true);
    global.__PATH__ = ''
  });

  test("type only", async () => {
    const dirname = "uberApi1";
    const dirPath = path.resolve(__dirname, "api", dirname + "TypeOnly")
    await freeSwagger({
      source: require(`./json/${dirname}`),
      root:dirPath ,
      typeOnly: true,
      jsDoc: true
    });
    const file = fs.readFileSync(path.resolve(dirPath,'typedef/index.js'), "utf-8");
    expect(file).toMatchSnapshot();
  });
});
