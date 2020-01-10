// @ts-nocheck
/* eslint-disable */
import { IPagedResult_AuditLogListDto } from "./interface";
import axios from "axios";

export const GetAuditLogs = (params: { StartDate?: string }) =>
  axios.request<IPagedResult_AuditLogListDto>({
    url: `/api/services/app/AuditLog/GetAuditLogs`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
