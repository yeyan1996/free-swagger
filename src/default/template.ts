/* eslint-disable */

import { TemplateConfig } from "../utils";
export const jsTemplate = ({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  IParams,
  IPathParams
}: TemplateConfig) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (params,${
  IPathParams ? `pathParams` : ""
}) => axios.request({
     url: \`${url}\`, 
     method: "${method}",
     responseType: "${responseType}", 
     ${IParams ? `params:${method === "get" ? "params," : "{},"}` : ""}
     ${IParams ? `data:  ${method === "get" ? "{}," : "params,"}` : ""}
 })`;

export const tsTemplate = ({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  IResponse,
  IParams,
  IPathParams
}: TemplateConfig) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (${
  IParams ? `params: ${IParams}` : IPathParams ? "params:{[key:string]: never}," : ""
}${
  IPathParams ? `pathParams: ${IPathParams}` : ""
}) => axios.request<${IResponse || "any"}>({
     url: \`${url}\`, 
     method: "${method}",
     responseType: "${responseType}", 
     ${IParams ? `params:${method === "get" ? "params," : "{},"}` : ""}
     ${IParams ? `data: ${method === "get" ? "{}," : "params,"}` : ""}
 })`;
