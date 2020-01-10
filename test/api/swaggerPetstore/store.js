/* eslint-disable */
import axios from "axios";

// Returns pet inventories by status
export const getInventory = params =>
  axios.request({
    url: `/store/inventory`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Find purchase order by ID
export const getOrderById = (params, pathParams) =>
  axios.request({
    url: `/store/order/${arguments[1].orderId}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Delete purchase order by ID
export const deleteOrder = (params, pathParams) =>
  axios.request({
    url: `/store/order/${arguments[1].orderId}`,
    method: "delete",
    params: {},
    data: params,
    responseType: "json"
  });

// Place an order for a pet
export const placeOrder = params =>
  axios.request({
    url: `/store/order`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
