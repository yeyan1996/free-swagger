import { OpenAPIV2 } from 'openapi-types'
import { parsePath, Method } from 'free-swagger-core'
import { hasChinese } from '../utils'
import chalk from 'chalk'
import { memoize, flattenDeep, groupBy } from 'lodash'

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

export type ParsedPaths = Array<
  OpenAPIV2.OperationObject & { method: string; url: string }
>
export type ParsedPathsObject = Record<Method, ParsedPaths>

// 创建 api 的文件名
const createFilename = memoize(
  (tags: OpenAPIV2.TagObject[], tag: string) => {
    if (!tag) return ''
    if (hasChinese(tag)) {
      const item = tags!.find(({ name }) => name === tag)
      if (!item) return ''
      return item.description ? item.description : item.name
    } else {
      return tag
    }
  },
  (tags, tag) => tag
)

// 解析 swagger paths 字段
// 根据 tags[0] 做 groupBy
const groupByTag = (swagger: OpenAPIV2.Document): ParsedPathsObject =>
  groupBy(
    // 打平 operationObject 数组
    flattenDeep(
      Object.entries(swagger.paths).map(
        ([path, pathItem]: [string, OpenAPIV2.PathItemObject]) =>
          Object.entries(pathItem).map(
            ([method, operationItem]: [Method, OpenAPIV2.OperationObject]) => ({
              ...operationItem,
              method,
              url: path,
            })
          )
      )
    )
      .map((item) => ({
        ...item,
        filename: createFilename(swagger.tags!, item.tags?.[0] ?? ''),
      }))
      .filter((item) => {
        if (!item.tags?.[0]) {
          console.log(
            chalk.yellow(
              `${item.method.toUpperCase()} ${
                item.url
              } 的 tags 不存在,无法生成该 api`
            )
          )
          return false
        }
        // TODO 对没有 tags 的 path 做兼容
        return !!item.filename
      }),
    (o) => o.filename
  )

export { groupByTag, parsePath }
