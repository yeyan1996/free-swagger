const path = require("path");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();
const webpack = require("webpack");
const pkg = require("./package.json");
const UserScriptPlugin = require("./libs/user-script-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  publicPath:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8888"
      : `https://cdn.jsdelivr.net/npm/free-swagger-extends/dist`,
  productionSourceMap: false,
  chainWebpack: config => {
    config.optimization.delete("splitChunks");
    config.module.rule("fonts").uses.clear();
    config.module
      .rule("fonts")
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: Infinity
      })
      .end();
    config.module.rule("svg").uses.clear();
    config.module
      .rule("svg")
      .test(/\.svg$/)
      .include.add(path.join(__dirname, "src/icons")) //处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
    config.externals({
      "prettier/standalone": "prettier",
      "prettier/parser-typescript": "prettierPlugins.typescript",
      "prettier/parser-babylon": "prettierPlugins.babylon"
    });
  },
  configureWebpack: {
    devServer: {
      port: 8888
    },
    plugins: [
      new MonacoWebpackPlugin(),
      new GitRevisionPlugin({
        commithashCommand: "rev-list --max-count=1 --no-merges HEAD",
        versionCommand: "describe --always --tags",
        branch: true,
        branchCommand: "rev-parse --symbolic-full-name HEAD"
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(pkg.version),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch())
      }),
      new UserScriptPlugin({
        template: "./build/index.ejs",
        author: pkg.author,
        name: pkg.name,
        namespace: "http://tampermonkey.net/",
        description: pkg.description,
        version: pkg.version,
        include: ["swagger", "/doc.html"], // 设置脚本匹配网页正则
        scriptName: "userScript.js"
      })
    ]
  },
  css: {
    extract: false
  }
};
