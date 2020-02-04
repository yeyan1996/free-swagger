import path from "path";
import fs from "fs";
import freeSwagger from "../dist/main";

const wait = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

const assetFiles = async (apiDirName, apiFilesList) => {
  const root = path.resolve(__dirname, "api", apiDirName);
  const filesPath = fs.readdirSync(root);
  expect(filesPath).toEqual(apiFilesList);
  await wait(1000);
  filesPath.forEach(filename => {
    const file = fs.readFileSync(
      path.resolve(path.resolve(__dirname, `api/${apiDirName}`), filename),
      "utf-8"
    );
    expect(file).toMatchSnapshot();
  });
};

describe("test", () => {
  test("base option", async done => {
    const dirname = "swaggerPetstore";
    await freeSwagger({
      source: require("./json/swaggerPetstore"),
      root: path.resolve(__dirname, "api", dirname),
      chooseAll: true
    });
    await assetFiles(dirname, ["pet.js", "store.js", "user.js"]);
    done();
  });

  test("ts language", async done => {
    const dirname = "uberApi";
    await freeSwagger({
      source: require("./json/uberApi"),
      lang: "ts",
      root: path.resolve(__dirname, "api", dirname),
      chooseAll: true
    });
    await assetFiles(dirname, [
      "auditLog.ts",
      "device.ts",
      "interface.ts",
      "mappers.ts",
      "ymTicketTypical.ts"
    ]);
    done();
  });

  test("custom ts template", async done => {
    const dirname = "homeIotApi";
    await freeSwagger({
      source: require("./json/homeIotApi"),
      root: path.resolve(__dirname, "api", dirname),
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

    await assetFiles(dirname, [
      "device.ts",
      "environment.ts",
      "interface.ts",
      "zWave.ts",
      "zones.ts"
    ]);
    done();
  });

  // todo bin 测试
});
