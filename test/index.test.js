import path from "path";
import fs from "fs";
import freeSwagger from "../dist/main";
import inquirer from "inquirer";
import { init } from "../dist/bin/init";

const wait = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

const assertFiles = async (dirPath, apiFilesList) => {
  const filesPath = fs.readdirSync(dirPath);
  expect(filesPath).toEqual(apiFilesList);
  await wait(500);
  filesPath.forEach(filename => {
    const file = fs.readFileSync(path.resolve(dirPath, filename), "utf-8");
    expect(file).toMatchSnapshot();
  });
};

describe("pkg", () => {
  test("base option", async () => {
    const dirname = "swaggerPetstore";
    const dirPath = path.resolve(__dirname, "api", "pkg", dirname);
    await freeSwagger({
      source: require(`./json/${dirname}`),
      root: dirPath,
      chooseAll: true
    });
    await assertFiles(dirPath, ["pet.js", "store.js", "user.js"]);
  });

  test("ts language", async () => {
    const dirname = "uberApi";
    const dirPath = path.resolve(__dirname, "api", "pkg", dirname);
    await freeSwagger({
      source: require(`./json/${dirname}`),
      lang: "ts",
      root: dirPath,
      chooseAll: true
    });
    await assertFiles(dirPath, [
      "auditLog.ts",
      "device.ts",
      "interface.ts",
      "mappers.ts",
      "ymTicketTypical.ts"
    ]);
  });

  test("custom ts template", async () => {
    const dirname = "homeIotApi";
    const dirPath = path.resolve(__dirname, "api", "pkg", dirname);

    await freeSwagger({
      source: require(`./json/${dirname}`),
      root: dirPath,
      lang: "ts",
      templateFunction: ({
        url,
        summary,
        method,
        name,
        responseType,
        deprecated,
        IResponse,
        IParams,
        IPathParams
      }) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (params: ${
        IParams ? `${IParams}` : "{[key:string]: never}"
      },${
        IPathParams ? `pathParams: ${IPathParams}` : ""
      }) => http.request<${IResponse || "any"},AxiosResponse<${IResponse ||
        "any"}>>({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
 })`,
      customImportCode: "import http,{AxiosResponse} from 'axios'",
      chooseAll: true
    });

    await assertFiles(dirPath, [
      "device.ts",
      "environment.ts",
      "interface.ts",
      "zWave.ts",
      "zones.ts"
    ]);
  });
});

describe("bin", () => {
  let backup;
  // todo 清楚记忆缓存
  beforeAll(() => {
    backup = inquirer.prompt;
  });
  afterAll(() => {
    inquirer.prompt = backup;
  });
  beforeEach(() => {
    process.argv.length = 2;
  });

  test("zero config", async () => {
    const dirname = "swaggerPetstore";
    const dirPath = path.resolve(__dirname, "api", "bin", dirname);

    const fnSpy = jest.fn(() =>
      Promise.resolve({
        chooseAll: true,
        root: dirPath,
        source: path.resolve(__dirname, `./json/${dirname}.json`)
      })
    );
    inquirer.prompt = fnSpy;
    init();
    expect(fnSpy).toBeCalledTimes(1);
    await assertFiles(dirPath, ["pet.js", "store.js", "user.js"]);
  });

  // todo 记忆功能/增加覆盖率
});
