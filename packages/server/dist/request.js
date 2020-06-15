"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJSON = void 0;
const ora_1 = __importDefault(require("ora"));
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const PORT = 9998;
// 通过代理 + cookie 访问需要权限的数据
exports.fetchJSON = async (url, cookie) => {
    url = encodeURI(url);
    const spinner = ora_1.default().render();
    spinner.start(`正在发送请求到: ${url} \n`);
    let res;
    try {
        if (cookie) {
            // 受权限保护的数据走代理
            const { host, pathname, search } = new URL(url);
            const server = http_1.default.createServer();
            server.on('request', (req, res) => {
                const proxyReq = https_1.default.request({
                    hostname: host,
                    path: pathname + search,
                    method: req.method,
                    headers: { ...req.headers, host, cookie },
                }, (proxyRes) => {
                    res.writeHead(res.statusCode, {
                        ...proxyRes.headers,
                        'Access-Control-Allow-Origin': '*',
                    });
                    proxyRes.pipe(res, {
                        end: true,
                    });
                });
                req.pipe(proxyReq, {
                    end: true,
                });
            });
            server.listen(PORT);
            res = await axios_1.default.get(`http://localhost:${PORT}`);
            server.close();
        }
        else {
            // 普通数据则直接请求
            res = await axios_1.default.get(url);
        }
        if (typeof res.data !== 'object') {
            throw new Error('返回的数据不是 json');
        }
        spinner.succeed('请求结束');
        return res.data;
    }
    catch (e) {
        spinner.fail('请求失败，可能没有接口权限或者返回格式不正确');
        throw new Error(e);
    }
};
