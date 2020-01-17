/* eslint-disable */
import q from "axios";

// Find pet by ID
export const getPetById = (params, pathParams) =>
  axios.request({
    url: `/pet/${arguments[1].petId}`,
    method: "get",
    responseType: "json"
  });

// Updates a pet in the store with form data
export const updatePetWithForm = (params, pathParams) =>
  axios.request({
    url: `/pet/${arguments[1].petId}`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });

// Deletes a pet
export const deletePet = (params, pathParams) =>
  axios.request({
    url: `/pet/${arguments[1].petId}`,
    method: "delete",
    responseType: "json"
  });

// uploads an image
export const uploadFile = (params, pathParams) =>
  axios.request({
    url: `/pet/${arguments[1].petId}/uploadImage`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });

// Update an existing pet
export const updatePet = params =>
  axios.request({
    url: `/pet`,
    method: "put",
    responseType: "json",
    params: {},
    data: params
  });

// Add a new pet to the store
export const addPet = params =>
  axios.request({
    url: `/pet`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });

// Finds Pets by status
export const findPetsByStatus = params =>
  axios.request({
    url: `/pet/findByStatus`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
  });
/**deprecated*/
// Finds Pets by tags
export const findPetsByTags = params =>
  axios.request({
    url: `/pet/findByTags`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
  });
