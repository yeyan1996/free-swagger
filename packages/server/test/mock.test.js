import path from "path";
import fs from "fs";
import freeSwagger from "../src/main";
import { methods } from "../src/parse/path";

const assertFiles = async (dirPath, apiFilesList,shouldInclude = false) => {
  expect(fs.existsSync(path.resolve(dirPath, "mock.js"))).toBe(true);

  const filesPath = fs
    .readdirSync(dirPath)
    .filter(file => file.endsWith(".json"));

  if(shouldInclude){
    apiFilesList.forEach(filePath => {
      expect(filesPath.includes(filePath)).toBe(true);
    })
  }else{
    expect(filesPath).toEqual(apiFilesList);
  }

  filesPath.forEach(filename => {
    const file = JSON.parse(
      fs.readFileSync(path.resolve(dirPath, filename), "utf-8")
    );
    Object.keys(file).forEach(path => {
      expect(methods.includes(path.split(" ")[0].toLowerCase())).toBe(true);
      // todo mock 数据测试
    });
  });
};

describe("mock", () => {
  test("has mock.js", async () => {
    const dirname = "swaggerPetstore";
    const dirPath = path.resolve(__dirname, "mock", dirname);
    await freeSwagger.mock({
      source: require(path.resolve(__dirname,'json',dirname)),
      mockRoot: dirPath
    });
    await assertFiles(dirPath, ["pet.json", "store.json", "user.json"]);
  });

  test("wrap", async () => {
    const dirname = "homeIotApi";
    const dirPath = path.resolve(__dirname, "mock", dirname);
    await freeSwagger.mock({
      source: require(path.resolve(__dirname,'json',dirname)),
      mockRoot: dirPath,
      wrap: true
    });
    await assertFiles(dirPath, [
      "device.json",
      "environment.json",
      "zWave.json",
      "zones.json"
    ]);
  });

  test("should generate Even if $ ref is missing", async () => {
    const dirname = "uberApi";
    const dirPath = path.resolve(__dirname, "mock", dirname);
    await freeSwagger.mock({
      source: require(path.resolve(__dirname,'json',dirname)),
      mockRoot: dirPath,
      wrap: true
    });
    await assertFiles(dirPath, [
      "auditLog.json",
      "device.json",
      "estimates.json",
      "mappers.json",
      "products.json",
      "productsTest.json",
      "user.json",
      "ymTicketTypical.json"
    ]);
  });

  test("should work with only one string params", async () => {
    const dirname = "swaggerPetstore1";
    await freeSwagger.mock(path.resolve(__dirname, "json", `${dirname}.json`));
    await assertFiles(path.resolve(__dirname, "mock/default"), ["pet.json", "store.json", "user.json"],true);
  });

  test("should work with only one json params", async () => {
    const dirname = "uberApi1";
    await freeSwagger.mock(require(path.resolve(__dirname, "json", `${dirname}.json`)));
    await assertFiles(path.resolve(__dirname, "mock/default"), [
      "auditLog.json",
      "device.json",
      "mappers.json",
      "ymTicketTypical.json"
    ],true);
  });
});
