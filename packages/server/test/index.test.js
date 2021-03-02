import path from "path";
import fs from "fs";
import freeSwagger from "../src/main";

const wait = time =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time)
  );

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
  await wait(100);
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

describe("server", () => {
  beforeAll(() => {
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
      jsDoc:'simple'
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
      templateFunction: ({
                           url,
                           summary,
                           method,
                           name,
                           responseType,
                           deprecated,
                           pathParams,
                           IResponse,
                           IQueryParams,
                           IBodyParams,
                           IPathParams
                         }) => {
        // 处理路径参数
        // `/pet/{id}` => `/pet/${id}`
        const parsedUrl = url.replace(/{(.*?)}/g, '${$1}');

        const onlyIQueryParams = IQueryParams && !IBodyParams
        const onlyIBodyParams = IBodyParams && !IQueryParams
        const multipleParams = IQueryParams && IBodyParams

        return `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (${
  onlyIQueryParams
    ? `params: ${IQueryParams},`
    : onlyIBodyParams 
    ? `params: ${IBodyParams},`
    : multipleParams
    ? `params: ${IQueryParams},`
    // no params
    :  IPathParams
    ? "params:{[key:string]: never},"
    : ""
}${
  pathParams.length ? `{${pathParams.join(",")}}: ${IPathParams},` : multipleParams ? "pathParams:{[key:string]: never}," : ""
}${
  multipleParams
    ? `bodyParams: ${IBodyParams}`
    : ""
}) => http.request<${IResponse || "any"},AxiosResponse<${IResponse ||
"any"}>>({
     url: \`${parsedUrl}\`,
     method: "${method}",
     params:${`${ multipleParams ? "queryParams" : IQueryParams ? "params," : "{},"}`}
     data:${`${ multipleParams ? "bodyParams" : IBodyParams ? "params," : "{},"}`}
     ${responseType === "json" ? "" : `responseType: ${responseType}`}
 })`;
},
      customImportCode: `
            import {AxiosResponse} from 'axios'
            import http from 'http'
        `
        ,
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
    const dirname = "swaggerPetstore1";
    await freeSwagger(path.resolve(__dirname, "json", `${dirname}.json`));
    await assertFiles(
        path.resolve(__dirname, "api/default"),
        ["pet.js", "store.js", "user.js"],
        true
    );
  });

  test("should work with only one json params", async () => {
    const dirname = "uberApi1";
    await freeSwagger(require(path.resolve(__dirname, "json", `${dirname}.json`)));
    await assertFiles(path.resolve(__dirname, "api/default"), [
      "auditLog.js",
      "device.js",
      "mappers.js",
      "ymTicketTypical.js"
    ],true);
  });
});
