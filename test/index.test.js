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

const assertFiles = async (dirPath, apiFilesList,shouldInclude = false) => {
  const filesPath = fs.readdirSync(dirPath);
  if(shouldInclude){
    apiFilesList.forEach(filePath => {
      expect(filesPath.includes(filePath)).toBe(true);
    })
  }else{
    expect(filesPath).toEqual(apiFilesList);
  }
  await wait(100);
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
        pathParams,
        IResponse,
        IParams,
        IPathParams
      }) => {
        const parsedUrl = url.replace(/{(.*?)}/g, (_, $1) => `\${${$1}}`);

        return `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (${
          IParams
            ? `params: ${IParams},`
            : IPathParams
            ? "params:{[key:string]: never},"
            : ""
        }${
          pathParams.length ? `{${pathParams.join(",")}} = ${IPathParams}` : ""
        }) => http.request<${IResponse || "any"},AxiosResponse<${IResponse ||
          "any"}>>({
     url: \`${parsedUrl}\`, 
     method: "${method}",  
     params:${`${method === "get" ? "params," : "{},"}`}
     data:${`${method === "get" ? "{}," : "params,"}`}
     ${responseType === "json" ? "" : `responseType: ${responseType}`}
 })`;
      },
      customImportCode: "import http,{AxiosResponse} from 'axios'",
    });

    await assertFiles(dirPath, [
      "device.ts",
      "environment.ts",
      "interface.ts",
      "zWave.ts",
      "zones.ts"
    ]);
  });

  test("should work with only one string params", async () => {
    const dirname = "swaggerPetstore1";
    await freeSwagger(path.resolve(__dirname, "json", `${dirname}.json`));
    await assertFiles(path.resolve(__dirname, "api/pkg/default"), ["pet.js", "store.js", "user.js"],true);
  });

  test("should work with only one json params", async () => {
    const dirname = "uberApi1";
    await freeSwagger(require(path.resolve(__dirname, "json", `${dirname}.json`)));
    await assertFiles(path.resolve(__dirname, "api/pkg/default"), [
      "auditLog.js",
      "device.js",
      "mappers.js",
      "ymTicketTypical.js"
    ],true);
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
