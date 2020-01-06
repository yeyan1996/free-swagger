/* eslint-disable */
import axios from "axios";

export const GetAuditLogs = (params, pathParams) =>
  axios.request({
    url: `/api/services/app/AuditLog/GetAuditLogs`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
