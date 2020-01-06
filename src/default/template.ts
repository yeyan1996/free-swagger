import { TemplateConfig } from "../utils";
export const jsTemplate = ({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated
}: TemplateConfig): string => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (params,pathParams) => axios.request({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
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
}: TemplateConfig): string => `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (params: ${
  IParams ? `${IParams}` : "{[key:string]: never}"
},${
  IPathParams ? `pathParams: ${IPathParams}` : ""
}) => axios.request<${IResponse || "any"}>({
     url: \`${url}\`, 
     method: "${method}",
     params:${method === "get" ? "params" : "{}"},
     data:  ${method === "get" ? "{}" : "params"},
     responseType: "${responseType}", 
 })`;
