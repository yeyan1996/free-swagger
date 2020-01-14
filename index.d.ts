import { OpenAPIV2 } from "openapi-types";
import { Api } from "./src/parse/path";
import { Config } from "./src/utils";

declare function freeSwagger(
  config:
    | {
        source: string | OpenAPIV2.Document;
        root?: string;
        customImportCode?: string;
        lang?: "js" | "ts";
        chooseAll: boolean;
        template?: (config: {
          url: string;
          summary: string;
          method: string;
          name: string;
          responseType: string;
          deprecated: boolean;
          IResponse: string;
          IParams: string;
          IPathParams: string;
        }) => string;
      }
    | string
): Promise<OpenAPIV2.Document>;

declare function genPath(api: Api, config: Required<Config>): string;
declare function parsePath(
  name: string,
  url: string,
  // todo 类型优化
  method: string,
  { parameters, summary, responses, deprecated }: OpenAPIV2.OperationObject
): Api;

export default freeSwagger;
export { parsePath, genPath };
