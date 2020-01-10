// @ts-nocheck
/* eslint-disable */
import { JsonResult_Guid } from "./interface";
import axios, { AxiosResponse } from "axios";

// 新增或编辑标准票, 需走审批流程
export const AddOrUpdateTicketTypical = () =>
  axios.request<JsonResult_Guid, AxiosResponse<JsonResult_Guid>>({
    url: `/api/services/app/YmTicketTypical/AddOrUpdateTicketTypical`,
    method: "post",
    responseType: "json"
  });
