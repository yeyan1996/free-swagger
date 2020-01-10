/* eslint-disable */
import axios, { AxiosResponse } from "axios";

// Get user by user name
export const getUserByName = (params, pathParams) =>
  axios.request({
    url: `/user/${arguments[1].username}`,
    method: "get",
    responseType: "json"
  });

// Updated user
export const updateUser = (params, pathParams) =>
  axios.request({
    url: `/user/${arguments[1].username}`,
    method: "put",
    responseType: "json",
    params: {},
    data: params
  });

// Delete user
export const deleteUser = (params, pathParams) =>
  axios.request({
    url: `/user/${arguments[1].username}`,
    method: "delete",
    responseType: "json"
  });

// Logs user into the system
export const loginUser = params =>
  axios.request({
    url: `/user/login`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
  });

// Logs out current logged in user session
export const logoutUser = params =>
  axios.request({
    url: `/user/logout`,
    method: "get",
    responseType: "json"
  });

// Create user
export const createUser = params =>
  axios.request({
    url: `/user`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });

// Creates list of users with given input array
export const createUsersWithArrayInput = params =>
  axios.request({
    url: `/user/createWithArray`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });

// Creates list of users with given input array
export const createUsersWithListInput = params =>
  axios.request({
    url: `/user/createWithList`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });
