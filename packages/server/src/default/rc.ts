import path from 'path'
import os from 'os'
import fse from 'fs-extra'
import prettier from 'prettier'
import { pick, mergeWith } from 'lodash'
import { EOL } from 'os'
import { jsTemplate, tsTemplate } from 'free-swagger-client'
import { Config, MockConfig } from '../utils'
import {
  DEFAULT_CUSTOM_IMPORT_CODE_JS,
  DEFAULT_CUSTOM_IMPORT_CODE_TS,
} from './index'
import { execSync } from 'child_process'

const EXPORT_DEFAULT = 'export default'

// answer 继承自各自的 config

// mock answer
export type MockAnswer = Required<MockConfig<string>>

// config answer
export interface ConfigAnswer<T = string> extends Required<Config<string>> {
  previousSource: string
  shouldEditTemplate: 'y' | 'n'
  customImportCodeJs: string
  customImportCodeTs: string
  jsTemplate: string
  tsTemplate: string
  apiChoices: { name: string; checked: boolean }[]
}

class Rc {
  path: string
  configData: ConfigAnswer
  mockData: MockAnswer

  constructor() {
    this.path = path.resolve(os.homedir(), '.free-swaggerrc.js')
    fse.ensureFileSync(this.path)

    const dataContent = fse.readFileSync(this.path, 'utf-8') || '{}'
    // hack: 目的是取出 free-swaggerrc 中的代码片段
    /*eslint-disable*/
        let _obj = {};
        eval(`_obj = ` + dataContent.replace(new RegExp(`^${EXPORT_DEFAULT}`), ""));
        this.configData = {
            ...this.getDefaultConfigAnswer(),
            ...pick(_obj, Object.keys(this.getDefaultConfigAnswer()))
        };
        this.mockData = {
            ...this.getDefaultMockAnswer(),
            ...pick(_obj, Object.keys(this.getDefaultMockAnswer()))
        }
    }

    // 获取 inquirer 默认回答
    getDefaultConfigAnswer(): ConfigAnswer {
        return {
            previousSource: "",
            source: "",
            cookie: "",
            root: path.resolve(process.cwd(), "src/api"),
            lang: "js",
            shouldEditTemplate: "n",
            customImportCode: "",
            customImportCodeJs: DEFAULT_CUSTOM_IMPORT_CODE_JS,
            customImportCodeTs: DEFAULT_CUSTOM_IMPORT_CODE_TS,
            templateFunction: eval(tsTemplate),
            tsTemplate: tsTemplate,
            jsTemplate: jsTemplate,
            apiChoices: [],
            chooseAll: false
        };
    }

    getDefaultMockAnswer(): MockAnswer {
        return {
            source: "",
            cookie: "",
            mockRoot: (<any>global).__DEV__ ? path.resolve(__dirname, "../../test/mock/default") : path.resolve(process.cwd(), "mock"),
            wrap: false,
        };
    }

    // 获取默认配置项
    getConfig(): Config {
        return {
            source: this.configData.source,
            root: this.configData.root,
            lang: this.configData.lang,
            cookie: this.configData.cookie,
            customImportCode:this.configData.lang === "ts" ? this.configData.customImportCodeTs : this.configData.customImportCode,
            templateFunction: eval(
                this.configData.lang === "ts" ? this.configData.tsTemplate : this.configData.jsTemplate
            ),
            chooseAll: this.configData.chooseAll
        };
    }

    // 合并配置项
    merge(answer: Partial<ConfigAnswer>): void {
        this.configData = mergeWith(this.configData,answer,(old,now) => {
            if(!now) return old
        })
    }

    // 将配置项存储至 rc 文件
    save(): void {
        const data = JSON.stringify( mergeWith(this.configData,this.mockData,(old,now) => {
            if(!now) return old
        }));
        // hack: 由于 JSON.stringify 不能保存函数，这里手动将函数拼接并写入 rc 文件
        // 去除尾部分号，否则会报词法错误
        let templateFunction = this.configData.templateFunction
            ?.toString()
            .replace(EOL, "")
            .trim();
        if (templateFunction?.endsWith(";")) {
            templateFunction = templateFunction.slice(0, templateFunction.length - 1);
        }
        const dataWithFunction =
            data.slice(0, data.length - 1) +
            "," +
            `templateFunction:${templateFunction}}`;
        const code = prettier.format(`${EXPORT_DEFAULT} ${dataWithFunction}`, {
            parser: "babel"
        });
        fse.writeFileSync(this.path, code);
    }

    // 记录当前 source 和之前的 source
    // 对比两者判断是否需要清空用户选择的 api 缓存记录
    recordHash(newSource: string): void {
        this.configData.previousSource = this.configData.source;
        this.configData.source = newSource;
    }

    // 是否清空用户选择的 api 缓存记录
    shouldRefreshCache(): boolean {
        return this.configData.previousSource !== this.configData.source;
    }

    // 重置为默认配置项
    reset(): void {
        this.configData = this.getDefaultConfigAnswer();
        this.mockData = this.getDefaultMockAnswer();
        this.save();
    }

    // 查看配置项
    show(): void {
        console.log(mergeWith(this.configData,this.mockData,(old,now) => {
            if(!now) return old
        }));
    }

    // 打开编辑器编辑模版
    edit(): void {
        execSync(`code ${this.path}`);
    }
}

export const rc = new Rc();
