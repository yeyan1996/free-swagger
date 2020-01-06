/* eslint-disable */
import axios from "axios";

export const UpdateMapper = (params, pathParams) =>
  axios.request({
    url: `/crawler/v1/mapper/${arguments[1]["mapper.id"]}`,
    method: "put",
    params: {},
    data: params,
    responseType: "json"
  });
