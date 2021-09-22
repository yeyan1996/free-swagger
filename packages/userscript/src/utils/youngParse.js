// format 不规范的 json
export default string => {
  if (!string) return;
  if (typeof string !== "string") {
    console.error("请传入string");
    return {};
  }
  let scopedData = {};
  try {
    return JSON.parse(string);
  } catch {
    string = `scopedData.$JSON = ${string}`;
    try {
      eval(string);
    } catch (e) {
      console.error(string);
      console.error(e);
      return {};
    }
    return scopedData.$JSON;
  }
};
