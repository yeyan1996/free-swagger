// @ts-nocheck
/* eslint-disable */
import http, { AxiosResponse } from "axios";

export const getZones = (params: { [key: string]: never }) =>
  http.request<string[], AxiosResponse<string[]>>({
    url: `/zones`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const quietZone = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
  }
) =>
  http.request<any, AxiosResponse<any>>({
    url: `/zones/${arguments[1].zoneId}/quiet`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
