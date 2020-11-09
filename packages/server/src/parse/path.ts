import { OpenAPIV2 } from 'openapi-types'
import { parsePath, Api, Method } from 'free-swagger-client'
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

export interface ParsedPaths {
  [controllerName: string]: ApiCollection
}

export interface ApiCollection {
  [pathName: string]: Api
}

const parsePaths = (swagger: OpenAPIV2.Document): ParsedPaths => {
  const requestClasses: ParsedPaths = {}

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
        let controllerName = ''
        if (hasChinese(operationObject.tags[0])) {
          const tag = swagger.tags!.find(
            (tag: OpenAPIV2.TagObject) => tag.name === operationObject.tags![0]
          )
          if (!tag) return
          controllerName = tag.description
            ? pascalCase(tag.description)
            : tag.name
        } else {
          controllerName = pascalCase(operationObject.tags[0])
        }

        if (!requestClasses[controllerName]) {
          requestClasses[controllerName] = {}
        }
        requestClasses[controllerName][operationObject.operationId] = parsePath(
          operationObject.operationId,
          `${swagger.basePath}${path}`,
          method,
          operationObject
        )
      })
    }
  )
  return requestClasses
}

export { parsePaths, parsePath }
