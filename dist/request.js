"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const PORT = 9998;
// 通过代理 + cookie 访问需要权限的数据
exports.fetchJSON = async (url, cookie) => {
    url = encodeURI(url);
    const spinner = ora_1.default().render();
    spinner.start(`正在发送请求到: ${url}`);
    let res;
    try {
        if (cookie) {
            // 受权限保护的数据走代理
            const { host, pathname } = new URL(url);
            const server = http_1.default.createServer();
            server.on("request", (req, res) => {
                const proxy = https_1.default.request({
                    hostname: host,
                    path: req.url,
                    method: req.method,
                    headers: { ...req.headers, host, cookie }
                }, proxyRes => {
                    res.writeHead(res.statusCode, {
                        ...proxyRes.headers,
                        "Access-Control-Allow-Origin": "*"
                    });
                    proxyRes.pipe(res, {
                        end: true
                    });
                });
                req.pipe(proxy, {
                    end: true
                });
            });
            server.listen(PORT);
            res = await axios_1.default.get(`http://localhost:${PORT}${pathname}`);
            server.close();
        }
        else {
            // 普通数据则直接请求
            res = await axios_1.default.get(url);
        }
        spinner.succeed("请求结束");
        return res.data;
    }
    catch (e) {
        spinner.fail("请求失败");
        throw new Error(e);
    }
};
