const path = require("path");
const fs = require("fs");
const freeSwagger = require("../src/main").default;
const { pascalCase } = require("../src/utils");

const wait = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

describe("test.ts", () => {
  test("base option", async done => {
    const { info } = await freeSwagger({
      source: require("./json/swaggerPetstore"),
      root: path.resolve(__dirname, "api"),
      chooseAll: true
    });

    const filesPath = fs.readdirSync(
      path.resolve(__dirname, "api", pascalCase(info.title))
    );
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
    const { info } = await freeSwagger({
      source: require("./json/uberApi"),
      lang: "ts",
      root: path.resolve(__dirname, "api"),
      chooseAll: true
    });

    const filesPath = fs.readdirSync(
      path.resolve(__dirname, "api", pascalCase(info.title))
    );
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
    const { info } = await freeSwagger({
      source: require("./json/homelotApi"),
      root: path.resolve(__dirname, "api"),
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
      }) => http.request<${IResponse || "any"},AxiosResponse<${IResponse || "any"}>>({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
 })`,
      customImportCode: "import http,{AxiosResponse} from 'axios'",
      chooseAll: true
    });

    const filesPath = fs.readdirSync(
      path.resolve(__dirname, "api", pascalCase(info.title))
    );
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
});
