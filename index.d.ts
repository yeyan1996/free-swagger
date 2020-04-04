import { OpenAPIV2 } from "openapi-types";
import { Config } from "./src/utils";

declare function freeSwagger(
  config: Config | string
): Promise<OpenAPIV2.Document>;

export default freeSwagger;
// todo mock 类型
