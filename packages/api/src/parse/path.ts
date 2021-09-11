import { OpenAPIV2 } from 'openapi-types'
import { parsePath, ParsedApi, Method } from 'free-swagger-core'
import { hasChinese, pascalCase } from '../utils'
import chalk from 'chalk'

export const methods: Method[] = [
  'get',
  'put',
  'post',
  'del',
  'delete',
  'options',
  'head',
  'patch',
]

export type ParsedPaths = Pick<ParsedApi, 'url' | 'method'>[]
export type ParsedPathsObject = Record<string, ParsedPaths>

// 解析 swagger paths 字段
const parsePaths = (swagger: OpenAPIV2.Document): ParsedPathsObject => {
  const parsedPathsObject: ParsedPathsObject = {}

  Object.entries<OpenAPIV2.PathItemObject>(swagger.paths).forEach(
    ([path, pathItemObject]) => {
      methods.forEach((method: Method) => {
        const operationObject = pathItemObject[method]
        if (!operationObject) return

        if (!operationObject.operationId) {
          console.log(
            chalk.yellow(
              `${method.toUpperCase()} ${path} 的 operationId 不存在,无法生成该 api`
            )
          )
          return
        }

        if (!operationObject.tags?.[0]) {
          console.log(
            chalk.yellow(
              `${method.toUpperCase()} ${path} 的 tags 不存在,无法生成该 api`
            )
          )
          return
        }

        // 含有中文则使用 description 作为文件名
        let filename = ''
        if (hasChinese(operationObject.tags[0])) {
          const tag = swagger.tags!.find(
            (tag: OpenAPIV2.TagObject) => tag.name === operationObject.tags![0]
          )
          if (!tag) return
          filename = tag.description ? pascalCase(tag.description) : tag.name
        } else {
          filename = pascalCase(operationObject.tags[0])
        }

        if (!parsedPathsObject[filename]) {
          parsedPathsObject[filename] = []
        }
        parsedPathsObject[filename].push({
          url: path,
          method,
        })
      })
    }
  )
  return parsedPathsObject
}

export { parsePaths, parsePath }
