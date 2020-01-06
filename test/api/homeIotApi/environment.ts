// @ts-nocheck
/* eslint-disable */
import { TemperatureSummary, ForecastResponse, TemperatueZoneStatus, HeaterState, ApiResponse } from "./interface";
import http from "axios";

export const temperatureSummary = (params: { [key: string]: never }) =>
  axios.request<TemperatureSummary>({
    url: `/temperature`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const getForecast = (
  params: { [key: string]: never },
  pathParams: {
    days: number;
  }
) =>
  axios.request<ForecastResponse>({
    url: `/temperature/forecast/${arguments[1].days}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const getZoneTemperature = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
  }
) =>
  axios.request<TemperatueZoneStatus>({
    url: `/temperature/${arguments[1].zoneId}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const getHeaterState = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
  }
) =>
  axios.request<HeaterState>({
    url: `/temperature/${arguments[1].zoneId}/heater`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const setHeaterState = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
    state: string;
  }
) =>
  axios.request<ApiResponse>({
    url: `/temperature/${arguments[1].zoneId}/heater/${arguments[1].state}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
