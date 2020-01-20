// @ts-nocheck
/* eslint-disable */
import axios, { AxiosResponse } from "axios";

export const UpdateMapper = (
  params: { [key: string]: never },
  pathParams: {
    "mapper.id": string;
  }
) =>
  axios.request<string, AxiosResponse<string>>({
    url: `/crawler/v1/mapper/${arguments[1]["mapper.id"]}`,
    method: "put",
    params: {},
    data: params
  });
