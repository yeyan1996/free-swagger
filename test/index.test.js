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

describe("test", () => {
  test("base option", async done => {
    const { info } = await freeSwagger({
      source: require("./swaggerPetstore"),
      root: path.resolve(__dirname, "api"),
      chooseAll: true
    });

    const filesPath = fs.readdirSync(
      path.resolve(__dirname, "api", pascalCase(info.title))
    );
    expect(filesPath).toEqual([
      "interface.ts",
      "pet.ts",
      "store.ts",
      "user.ts"
    ]);
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

  test("lang", async done => {
    const { info } = await freeSwagger({
      source: require("./uberApi"),
      lang: "js",
      root: path.resolve(__dirname, "api"),
      chooseAll: true
    });

    const filesPath = fs.readdirSync(
      path.resolve(__dirname, "api", pascalCase(info.title))
    );
    expect(filesPath).toEqual([
      "auditLog.js",
      "device.js",
      "mappers.js",
      "ymTicketTypical.js"
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

  test("template", async done => {
    const { info } = await freeSwagger({
      source: require("./homelotApi"),
      root: path.resolve(__dirname, "api"),
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
      }) => axios.request<${IResponse || "any"}>({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
 })`,
      customImportCode: "import http from 'axios'",
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
