import { OpenAPIV2 } from 'openapi-types'
import ora from 'ora'
import axios from 'axios'
import http from 'http'
import https from 'https'

const PORT = 9998
function isEncoded(uri: string) {
  uri = uri || ''
  return uri !== decodeURIComponent(uri)
}
function fullyDecodeURI(uri: string) {
  while (isEncoded(uri)) {
    uri = decodeURIComponent(uri)
  }
  return uri
}

function superEncodeUrl(uri: string) {
  return encodeURI(fullyDecodeURI(uri))
}

// 通过代理 + cookie 访问需要权限的数据
export const fetchJSON = async (
  url: string,
  cookie?: string
): Promise<OpenAPIV2.Document> => {
  url = superEncodeUrl(url)
  const spinner = ora().render()
  spinner.start(`正在发送请求到: ${url} \n`)
  let res
  try {
    if (cookie) {
      // 受权限保护的数据走代理
      const { host, pathname, search } = new URL(url)
      const server = http.createServer()
      server.on('request', (req, res) => {
        const proxyReq = https.request(
          {
            hostname: host,
            path: pathname + search,
            method: req.method,
            headers: { ...req.headers, host, cookie },
          },
          (proxyRes) => {
            res.writeHead(res.statusCode, {
              ...proxyRes.headers,
              'Access-Control-Allow-Origin': '*',
            })
            proxyRes.pipe(res, {
              end: true,
            })
          }
        )
        req.pipe(proxyReq, {
          end: true,
        })
      })
      server.listen(PORT)
      res = await axios.get(`http://localhost:${PORT}`)
      server.close()
    } else {
      // 普通数据则直接请求
      res = await axios.get(url)
    }
    if (typeof res.data !== 'object') {
      throw new Error('返回的数据不是 json')
    }
    spinner.succeed('请求结束')
    return res.data
  } catch (e) {
    spinner.fail('请求失败，可能没有接口权限或者返回格式不正确')
    throw new Error(e)
  }
}
