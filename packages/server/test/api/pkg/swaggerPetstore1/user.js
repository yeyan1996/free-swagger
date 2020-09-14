/* eslint-disable */
// generated by free-swagger

import axios from "axios";
/**
 * @description Get user by user name
 * @param {Object} params -never
 * @param {Object} pathParams
 * @param {string} pathParams.username -The name that needs to be fetched. Use user1 for testing.
 **/

// Get user by user name
export const getUserByName = (params, { username }) =>
  axios.request({
    url: `/user/${username}`,
    method: "get",
    params: {},
    data: {}
  });
/**
 * @description Updated user
 * @param {User} params -Updated user object
 * @param {Object} pathParams
 * @param {string} pathParams.username -name that need to be updated
 **/

// Updated user
export const updateUser = (params, { username }) =>
  axios.request({
    url: `/user/${username}`,
    method: "put",
    params: {},
    data: params
  });
/**
 * @description Delete user
 * @param {Object} params -never
 * @param {Object} pathParams
 * @param {string} pathParams.username -The name that needs to be deleted
 **/

// Delete user
export const deleteUser = (params, { username }) =>
  axios.request({
    url: `/user/${username}`,
    method: "delete",
    params: {},
    data: {}
  });
/** 
 * @description Logs user into the system  
 * @param {{
    "username": string
    "password": string
}} params 
 **/

// Logs user into the system
export const loginUser = (params) =>
  axios.request({
    url: `/user/login`,
    method: "get",
    params: params,
    data: {}
  });
/**
 * @description Logs out current logged in user session  **/

// Logs out current logged in user session
export const logoutUser = () =>
  axios.request({
    url: `/user/logout`,
    method: "get",
    params: {},
    data: {}
  });
/**
 * @description Create user
 * @param {User} params -Created user object
 **/

// Create user
export const createUser = (params) =>
  axios.request({
    url: `/user`,
    method: "post",
    params: {},
    data: params
  });
/**
 * @description Creates list of users with given input array
 * @param {User[]} params -List of user object
 **/

// Creates list of users with given input array
export const createUsersWithArrayInput = (params) =>
  axios.request({
    url: `/user/createWithArray`,
    method: "post",
    params: {},
    data: params
  });
/**
 * @description Creates list of users with given input array
 * @param {User[]} params -List of user object
 **/

// Creates list of users with given input array
export const createUsersWithListInput = (params) =>
  axios.request({
    url: `/user/createWithList`,
    method: "post",
    params: {},
    data: params
  });