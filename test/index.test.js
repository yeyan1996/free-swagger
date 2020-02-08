import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import freeSwagger from "../src/main";
import { init } from "../src/bin/init";
import { rc } from "../src/default/rc";

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
  beforeAll(() => {
    rc.reset();
    backup = inquirer.prompt;
  });
  afterAll(() => {
    inquirer.prompt = backup;
    rc.reset();
  });
  beforeEach(() => {
    process.argv.length = 2;
  });

  test("zero config", done => {
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
    init(() => {
      assertFiles(dirPath, ["pet.js", "store.js", "user.js"]);
      expect(fnSpy).toBeCalledTimes(1);
      done();
    });
  });

  test("can remember previous(zero config) configuration", () => {
    expect(rc.data).toMatchSnapshot();
  });

  test("ts language", done => {
    const dirname = "uberApi";
    const dirPath = path.resolve(__dirname, "api", "bin", dirname);

    inquirer.prompt = () =>
      Promise.resolve({
        chooseAll: true,
        lang: "ts",
        root: dirPath,
        source: path.resolve(__dirname, `./json/${dirname}.json`)
      });
    init(() => {
      assertFiles(dirPath, [
        "auditLog.ts",
        "device.ts",
        "interface.ts",
        "mappers.ts",
        "ymTicketTypical.ts"
      ]);
      done();
    });
  });

  test("can remember previous(ts language) configuration", () => {
    expect(rc.data).toMatchSnapshot();
  });
});
