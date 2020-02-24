import { OpenAPIV2 } from "openapi-types";
import ora from "ora";
import axios from "axios";
import http from "http";
import https from "https";

const PORT = 9998;

// 通过代理 + cookie 访问需要权限的数据
export const fetchJSON = async (
  url: string,
  cookie: string
): Promise<OpenAPIV2.Document> => {
  url = encodeURI(url);
  const spinner = ora().render();
  spinner.start(`正在发送请求到: ${url}`);
  let res;
  try {
    if (cookie) {
      // 受权限保护的数据走代理
      const { host, pathname } = new URL(url);
      const server = http.createServer();
      server.on("request", (req, res) => {
        const proxy = https.request(
          {
            hostname: host,
            path: req.url,
            method: req.method,
            headers: { ...req.headers, host, cookie }
          },
          proxyRes => {
            res.writeHead(res.statusCode, {
              ...proxyRes.headers,
              "Access-Control-Allow-Origin": "*"
            });
            proxyRes.pipe(res, {
              end: true
            });
          }
        );
        req.pipe(proxy, {
          end: true
        });
      });
      server.listen(PORT);
      res = await axios.get(`http://localhost:${PORT}${pathname}`);
      server.close();
    } else {
      // 普通数据则直接请求
      res = await axios.get(url);
    }
    spinner.succeed("请求结束");
    return res.data;
  } catch (e) {
    spinner.fail("请求失败");
    throw new Error(e);
  }
};
