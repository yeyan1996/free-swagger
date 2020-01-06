// @ts-nocheck
/* eslint-disable */
import http from "axios";

export const getZones = (params: { [key: string]: never }) =>
  axios.request<string[]>({
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
  axios.request<any>({
    url: `/zones/${arguments[1].zoneId}/quiet`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
