// @ts-nocheck
/* eslint-disable */
import { ApiResponse, DeviceState, LightingSummary } from "./interface";
import http from "axios";

export const setDimmer = (
  params: { [key: string]: never },
  pathParams: {
    deviceId: string;
    value: number;
  }
) =>
  axios.request<ApiResponse>({
    url: `/lighting/dimmers/${arguments[1].deviceId}/${arguments[1].value}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

export const setDimmerTimer = (
  params: { [key: string]: never },
  pathParams: {
    deviceId: string;
    value: number;
    timeunit: number;
  }
) =>
  axios.request<ApiResponse>({
    url: `/lighting/dimmers/${arguments[1].deviceId}/${arguments[1].value}/timer/${arguments[1].timeunit}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

export const getSwitchState = (
  params: { [key: string]: never },
  pathParams: {
    deviceId: string;
  }
) =>
  axios.request<DeviceState>({
    url: `/lighting/switches/${arguments[1].deviceId}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const setSwitch = (
  params: { [key: string]: never },
  pathParams: {
    deviceId: string;
    value: string;
  }
) =>
  axios.request<ApiResponse>({
    url: `/lighting/switches/${arguments[1].deviceId}/${arguments[1].value}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

export const setSwitchTimer = (
  params: { [key: string]: never },
  pathParams: {
    deviceId: string;
    value: string;
    minutes: number;
  }
) =>
  axios.request<ApiResponse>({
    url: `/lighting/switches/${arguments[1].deviceId}/${arguments[1].value}/timer/${arguments[1].minutes}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

export const getLightingSummary = (params: { [key: string]: never }) =>
  axios.request<LightingSummary>({
    url: `/lightingSummary`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
