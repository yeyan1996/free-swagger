export const jsTemplate = `({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  pathParams,
  IParams,
  IPathParams
}) => {
  // 处理路径参数
  // \`/pet/{id}\` => \`/pet/\${id}\`
 const parsedUrl = url.replace(/{(.*?)}/g, '\${$1}'); 

  return \`
  \${deprecated ? \`/**deprecated*/\` : ""}
  \${summary ? \`// \${summary}\` : ""}
  export const \${name} = (params,\${
  pathParams.length ? \`{\${pathParams.join(",")}}\` : ""
}) => axios.request({
     url: \\\`\${parsedUrl}\\\`,
     method: "\${method}",
     params:${`\${method === "get" ? IParams ? "params," : "{}," : "{},"}`}
     data:${`\${method === "get" ? "{}," : IParams ? "params," : "{},"}`}
     \${responseType === "json" ? "" : \`responseType: \${responseType}\`}
 })\`;
};`

export const tsTemplate = `({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  pathParams,
  IResponse,
  IParams,
  IPathParams
}) => {
  // 处理路径参数
  // \`/pet/{id}\` => \`/pet/\${id}\`
 const parsedUrl = url.replace(/{(.*?)}/g, '\${$1}'); 

  return \`
  \${deprecated ? \`/**deprecated*/\` : ""}
  \${summary ? \`// \${summary}\` : ""}  
  export const \${name} = (\${
  IParams
    ? \`params: \${IParams},\`
    : IPathParams
    ? "params:{[key:string]: never},"
    : ""
}\${
  pathParams.length ? \`{\${pathParams.join(",")}} : \${IPathParams}\` : ""
}) => axios.request<\${IResponse || "any"},AxiosResponse<\${IResponse ||
"any"}>>({
     url: \\\`\${parsedUrl}\\\`,
     method: "\${method}",
     params:${`\${method === "get" ? IParams ? "params," : "{}," : "{},"}`}
     data:${`\${method === "get" ? "{}," : IParams ? "params," : "{},"}`}
     \${responseType === "json" ? "" : \`responseType: \${responseType}\`}
 })\`;
};`
