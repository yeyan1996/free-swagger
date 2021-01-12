export const jsTemplate = `// js template
({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  pathParams,
  IQueryParams,
  IBodyParams,
  IPathParams
}) => {
  // 处理路径参数
  // \`/pet/{id}\` => \`/pet/\${id}\`
 const parsedUrl = url.replace(/{(.*?)}/g, '\${$1}'); 

 const onlyIQueryParams = IQueryParams && !IBodyParams
 const onlyIBodyParams = IBodyParams && !IQueryParams
 const multipleParams = IQueryParams && IBodyParams
 
  return \`
  \${deprecated ? \`/**deprecated*/\` : ""}
  \${summary ? \`// \${summary}\` : ""}
  export const \${name} = (\${
   onlyIQueryParams
    ? "params,"
    : onlyIBodyParams 
    ? "params,"
    : multipleParams
    ? "queryParams,"
    // no params
    : IPathParams
    ? "params,"
    : ""
  }\${
  IPathParams ? \`{\${pathParams.join(",")}},\` : multipleParams ? "pathParams," : ""
}\${
  multipleParams
    ? \`bodyParams: \${IBodyParams}\`
    : ""
}) => axios.request({
     url: \\\`\${parsedUrl}\\\`,
     method: "\${method}",
     params:${`\${ multipleParams ? "queryParams," : IQueryParams ? "params," : "{},"}`}
     data:${`\${ multipleParams ? "bodyParams" : IBodyParams ? "params," : "{},"}`}
     \${responseType === "json" ? "" : \`responseType: \${responseType}\`}
 })\`;
};
`

export const tsTemplate = `// ts template
({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  pathParams,
  IResponse,
  IQueryParams,
  IBodyParams,
  IPathParams
}) => {
  // 处理路径参数
  // \`/pet/{id}\` => \`/pet/\${id}\`
 const parsedUrl = url.replace(/{(.*?)}/g, '\${$1}'); 
 
 const onlyIQueryParams = IQueryParams && !IBodyParams
 const onlyIBodyParams = IBodyParams && !IQueryParams
 const multipleParams = IQueryParams && IBodyParams
 
  return \`
  \${deprecated ? \`/**deprecated*/\` : ""}
  \${summary ? \`// \${summary}\` : ""}  
  export const \${name} = (\${
  onlyIQueryParams
    ? \`params: \${IQueryParams},\`
    : onlyIBodyParams 
    ? \`params: \${IBodyParams},\`
    : multipleParams
    ? \`params: \${IQueryParams},\`
    // no params
    :  IPathParams
    ? "params:{[key:string]: never},"
    : ""
}\${
  pathParams.length ? \`{\${pathParams.join(",")}}: \${IPathParams},\` : multipleParams ? "pathParams:{[key:string]: never}," : ""
}\${
  multipleParams
    ? \`bodyParams: \${IBodyParams}\`
    : ""
}) => axios.request<\${IResponse || "any"},AxiosResponse<\${IResponse ||
"any"}>>({
     url: \\\`\${parsedUrl}\\\`,
     method: "\${method}",
     params:${`\${ multipleParams ? "queryParams," : IQueryParams ? "params," : "{},"}`}
     data:${`\${ multipleParams ? "bodyParams" : IBodyParams ? "params," : "{},"}`}
     \${responseType === "json" ? "" : \`responseType: \${responseType}\`}
 })\`;
};
`
