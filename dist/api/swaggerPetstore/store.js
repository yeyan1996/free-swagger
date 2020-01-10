"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Returns pet inventories by status
exports.getInventory = () => axios_1.default.request({
    url: `/store/inventory`,
    method: "get",
    responseType: "json"
});
// Find purchase order by ID
exports.getOrderById = (params, pathParams) => axios_1.default.request({
    url: `/store/order/${arguments[1].orderId}`,
    method: "get",
    responseType: "json"
});
// Delete purchase order by ID
exports.deleteOrder = (params, pathParams) => axios_1.default.request({
    url: `/store/order/${arguments[1].orderId}`,
    method: "delete",
    responseType: "json"
});
// Place an order for a pet
exports.placeOrder = (params) => axios_1.default.request({
    url: `/store/order`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
