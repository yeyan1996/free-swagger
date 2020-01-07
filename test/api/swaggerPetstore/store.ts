// @ts-nocheck
/* eslint-disable */
import { Order } from "./interface";
import axios from "axios";

// Returns pet inventories by status
export const getInventory = (params: { [key: string]: never }) =>
  axios.request<object>({
    url: `/store/inventory`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Find purchase order by ID
export const getOrderById = (
  params: { [key: string]: never },
  pathParams: {
    orderId: number;
  }
) =>
  axios.request<Order>({
    url: `/store/order/${arguments[1].orderId}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Delete purchase order by ID
export const deleteOrder = (
  params: { [key: string]: never },
  pathParams: {
    orderId: number;
  }
) =>
  axios.request<any>({
    url: `/store/order/${arguments[1].orderId}`,
    method: "delete",
    params: {},
    data: params,
    responseType: "json"
  });

// Place an order for a pet
export const placeOrder = (params: string) =>
  axios.request<Order>({
    url: `/store/order`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
