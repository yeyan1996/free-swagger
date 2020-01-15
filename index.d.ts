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



export default freeSwagger;

