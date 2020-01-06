// @ts-nocheck
/* eslint-disable */
import { User } from "./interface";
import axios from "axios";

// Get user by user name
export const getUserByName = (
  params: { [key: string]: never },
  pathParams: {
    username: string;
  }
) =>
  axios.request<User>({
    url: `/user/${arguments[1].username}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Updated user
export const updateUser = (
  params: User,
  pathParams: {
    username: string;
  }
) =>
  axios.request<any>({
    url: `/user/${arguments[1].username}`,
    method: "put",
    params: {},
    data: params,
    responseType: "json"
  });

// Delete user
export const deleteUser = (
  params: { [key: string]: never },
  pathParams: {
    username: string;
  }
) =>
  axios.request<any>({
    url: `/user/${arguments[1].username}`,
    method: "delete",
    params: {},
    data: params,
    responseType: "json"
  });

// Logs user into the system
export const loginUser = (params: { username: string; password: string }) =>
  axios.request<string>({
    url: `/user/login`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Logs out current logged in user session
export const logoutUser = (params: { [key: string]: never }) =>
  axios.request<any>({
    url: `/user/logout`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Create user
export const createUser = (params: User) =>
  axios.request<any>({
    url: `/user`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

// Creates list of users with given input array
export const createUsersWithArrayInput = (params: User[]) =>
  axios.request<any>({
    url: `/user/createWithArray`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

// Creates list of users with given input array
export const createUsersWithListInput = (params: User[]) =>
  axios.request<any>({
    url: `/user/createWithList`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
