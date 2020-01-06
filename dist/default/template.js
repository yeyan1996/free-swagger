"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsTemplate = ({ url, summary, method, name, responseType, deprecated }) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (params,pathParams) => axios.request({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
 })`;
exports.tsTemplate = ({ url, summary, method, name, responseType, deprecated, IResponse, IParams, IPathParams }) => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (params: ${IParams ? `${IParams}` : "{[key:string]: never}"},${IPathParams ? `pathParams: ${IPathParams}` : ""}) => axios.request<${IResponse || "any"}>({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
 })`;
