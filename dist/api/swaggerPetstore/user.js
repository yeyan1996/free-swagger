"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Get user by user name
exports.getUserByName = (params, pathParams) => axios_1.default.request({
    url: `/user/${arguments[1].username}`,
    method: "get",
    responseType: "json"
});
// Updated user
exports.updateUser = (params, pathParams) => axios_1.default.request({
    url: `/user/${arguments[1].username}`,
    method: "put",
    responseType: "json",
    params: {},
    data: params
});
// Delete user
exports.deleteUser = (params, pathParams) => axios_1.default.request({
    url: `/user/${arguments[1].username}`,
    method: "delete",
    responseType: "json"
});
// Logs user into the system
exports.loginUser = (params) => axios_1.default.request({
    url: `/user/login`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
});
// Logs out current logged in user session
exports.logoutUser = () => axios_1.default.request({
    url: `/user/logout`,
    method: "get",
    responseType: "json"
});
// Create user
exports.createUser = (params) => axios_1.default.request({
    url: `/user`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
// Creates list of users with given input array
exports.createUsersWithArrayInput = (params) => axios_1.default.request({
    url: `/user/createWithArray`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
// Creates list of users with given input array
exports.createUsersWithListInput = (params) => axios_1.default.request({
    url: `/user/createWithList`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
