// @ts-nocheck
/* eslint-disable */
import { DeviceRegistrationInfo } from "./interface";
import http from "axios";

export const getDevices = (params: { skip?: number; limit?: number }) =>
  axios.request<string[]>({
    url: `/devices`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const register = (params: DeviceRegistrationInfo) =>
  axios.request<any>({
    url: `/devices`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
