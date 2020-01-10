// @ts-nocheck
/* eslint-disable */
import axios from "axios";

export const UpdateMapper = (
  params: { [key: string]: never },
  pathParams: {
    "mapper.id": string;
  }
) =>
  axios.request<string>({
    url: `/crawler/v1/mapper/${arguments[1]["mapper.id"]}`,
    method: "put",
    responseType: "json"
  });
