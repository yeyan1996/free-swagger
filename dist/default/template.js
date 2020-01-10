"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsTemplate = ({ url, summary, method, name, responseType, deprecated, IParams, IPathParams }) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (params,${IPathParams ? `pathParams` : ""}) => axios.request({
     url: \`${url}\`, 
     method: "${method}",
     responseType: "${responseType}", 
     ${IParams ? `params:${method === "get" ? "params," : "{},"}` : ""}
     ${IParams ? `data:  ${method === "get" ? "{}," : "params,"}` : ""}
 })`;
exports.tsTemplate = ({ url, summary, method, name, responseType, deprecated, IResponse, IParams, IPathParams }) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (${IParams
    ? `params: ${IParams},`
    : IPathParams
        ? "params:{[key:string]: never},"
        : ""}${IPathParams ? `pathParams: ${IPathParams}` : ""}) => axios.request<${IResponse || "any"},AxiosResponse<${IResponse || "any"}>>({
     url: \`${url}\`, 
     method: "${method}",
     responseType: "${responseType}", 
     ${IParams ? `params:${method === "get" ? "params," : "{},"}` : ""}
     ${IParams ? `data: ${method === "get" ? "{}," : "params,"}` : ""}
 })`;
