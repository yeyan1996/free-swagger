import path from "path";
import fs from "fs";
import freeSwagger from "../dist/main";

const wait = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

describe("test", () => {
  test("base option", async done => {
    const root = path.resolve(__dirname, "api", "swaggerPetstore");
    await freeSwagger({
      source: require("./json/swaggerPetstore"),
      root,
      chooseAll: true
    });
    const filesPath = fs.readdirSync(root);
    expect(filesPath).toEqual(["pet.js", "store.js", "user.js"]);
    await wait(1000);
    filesPath.forEach(filename => {
      const file = fs.readFileSync(
        path.resolve(path.resolve(__dirname, "api/swaggerPetstore"), filename),
        "utf-8"
      );
      expect(file).toMatchSnapshot();
    });
    done();
  });

  test("ts language", async done => {
    const root = path.resolve(__dirname, "api", "uberApi");
    await freeSwagger({
      source: require("./json/uberApi"),
      lang: "ts",
      root,
      chooseAll: true
    });
    const filesPath = fs.readdirSync(root);

    expect(filesPath).toEqual([
      "auditLog.ts",
      "device.ts",
      "interface.ts",
      "mappers.ts",
      "ymTicketTypical.ts"
    ]);
    await wait(1000);
    filesPath.forEach(filename => {
      const file = fs.readFileSync(
        path.resolve(path.resolve(__dirname, "api/uberApi"), filename),
        "utf-8"
      );
      expect(file).toMatchSnapshot();
    });
    done();
  });

  test("custom ts template", async done => {
    const root = path.resolve(__dirname, "api", "homeIotApi");
    await freeSwagger({
      source: require("./json/homeIotApi"),
      root,
      lang: "ts",
      template: ({
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

    const filesPath = fs.readdirSync(root);
    expect(filesPath).toEqual([
      "device.ts",
      "environment.ts",
      "interface.ts",
      "zWave.ts",
      "zones.ts"
    ]);
    await wait(1000);
    filesPath.forEach(filename => {
      const file = fs.readFileSync(
        path.resolve(path.resolve(__dirname, "api/homeIotApi"), filename),
        "utf-8"
      );
      expect(file).toMatchSnapshot();
    });
    done();
  });

  // todo bin 测试
  // todo template -> templateFunction
});
