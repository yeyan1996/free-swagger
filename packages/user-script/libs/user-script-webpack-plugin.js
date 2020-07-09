const path = require("path");
const fse = require("fs-extra");
const ejs = require("ejs");

const PluginName = "UserScriptWebpackPlugin";

class UserScriptWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PluginName, compilation => {
      if (!compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) return;
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
        PluginName,
        pluginArgs => {
          const { assets } = pluginArgs;
          const templateFunction = ejs.compile(
            fse.readFileSync(
              path.resolve(process.cwd(), this.options.template),
              "utf-8"
            )
          );
          // 排除 scriptName 属性
          const { scriptName: dummy, ...otherOptions } = this.options;
          const source = templateFunction({
            options: { ...otherOptions, files: assets }
          });
          const scriptName = this.options.scriptName.endsWith(".js")
            ? this.options.scriptName
            : `${this.options.scriptName}.js`;
          compilation.assets[scriptName] = {
            source() {
              return source;
            },
            size() {
              return source.length;
            }
          };
        }
      );
    });
  }
}

UserScriptWebpackPlugin.PluginName = PluginName;
module.exports = UserScriptWebpackPlugin;
