import { OpenAPIV2 } from 'openapi-types'
import { Method } from 'free-swagger-core'
import { pascalCase, hasChinese, MockConfig } from '../utils'
import { methods } from '../parse/path'
import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import camelcase from 'camelcase'
import SwaggerParser from '@apidevtools/json-schema-ref-parser'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsf = require('json-schema-faker')

const parsedUrl = (url: string): string => url.replace(/{(.*?)}/g, ':$1')
const SUCCESS_CODE = '200'
jsf.option({
  useExamplesValue: true,
  useDefaultValue: true,
  alwaysFakeOptionals: true,
  refDepthMax: 2,
  maxItems: 1,
  failOnInvalidTypes: false,
})

// 创建状态为 "200" 的模拟数据
const createMockSchema = (schema: object, key: string): object => {
  let mockSchema: any = {}
  try {
    mockSchema = jsf.generate(schema)
    console.log(chalk.green(`${key} 生成成功`))
  } catch (e) {
    // todo 环形 json 的处理
    console.log(chalk.red(`${key} 生成失败,可能存在成环数据，请手动 mock`))
  }
  if (mockSchema.code) mockSchema.code = SUCCESS_CODE

  return mockSchema
}

export const mock = async ({
  wrap,
  source,
  mockRoot,
}: Required<MockConfig<OpenAPIV2.Document>>): Promise<void> => {
  fse.ensureDirSync(mockRoot)

  const mockCollection: {
    [controllerName: string]: { [pathName: string]: OpenAPIV2.SchemaObject }
  } = {}

  /**补充缺失的 definitions*/
  Object.assign(source.definitions, {
    List: {
      type: 'array',
    },
  })
  // @ts-ignore
  const parsedSwagger = await SwaggerParser.dereference(source)
  // @ts-ignore
  Object.entries<OpenAPIV2.PathItemObject>(parsedSwagger.paths).forEach(
    ([path, pathItemObject]) => {
      methods.forEach(async (method: Method) => {
        const key = `${method.toUpperCase()} ${parsedUrl(path)}`
        // @ts-ignore
        const operationObject = pathItemObject[method]
        if (!operationObject) return

        if (!operationObject.tags?.[0]) {
          console.log(
            chalk.yellow(
              `${method.toUpperCase()} ${path} 的 tags 不存在,无法生成该 api`
            )
          )
          return
        }

        // 含有中文则使用 description 作为文件名
        let controllerName = ''
        if (hasChinese(operationObject.tags[0])) {
          const tag = parsedSwagger.tags!.find(
            (tag: OpenAPIV2.TagObject) => tag.name === operationObject.tags![0]
          )
          if (!tag) return
          controllerName = tag.description
            ? pascalCase(tag.description)
            : tag.name
        } else {
          controllerName = pascalCase(operationObject.tags[0])
        }

        if (!mockCollection[controllerName]) {
          mockCollection[controllerName] = {}
        }

        const schema = operationObject.responses?.[SUCCESS_CODE]?.schema
          ? createMockSchema(
              operationObject.responses[SUCCESS_CODE].schema,
              key
            )
          : {
              code: SUCCESS_CODE,
              msg: 'xxx',
              data: {},
            }

        mockCollection[controllerName][key] = wrap
          ? {
              code: SUCCESS_CODE,
              msg: 'xxx',
              data: schema,
            }
          : schema
      })
    }
  )
  Object.keys(mockCollection).forEach((controllerName) => {
    fse.writeFileSync(
      path.resolve(mockRoot, `${camelcase(controllerName)}.json`),
      JSON.stringify(mockCollection[controllerName], null, 2)
    )
  })

  // 将 mock 数据汇总在 mock.js 中导出
  fse.writeFileSync(
    path.resolve(mockRoot, 'mock.js'),
    `const fs = require("fs");
const path = require("path");
const mock = {};
fs.readdirSync(__dirname)
  .filter(file => file.endsWith(".json"))
  .forEach(file => {
    Object.assign(mock, require(path.resolve(__dirname,file)));
  });
module.exports = mock;
  `
  )
}
