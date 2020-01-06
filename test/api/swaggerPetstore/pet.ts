// @ts-nocheck
/* eslint-disable */
import { Pet, ApiResponse } from "./interface";
import axios from "axios";

// Find pet by ID
export const getPetById = (
  params: { [key: string]: never },
  pathParams: {
    petId: number;
  }
) =>
  axios.request<Pet>({
    url: `/pet/${arguments[1].petId}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

// Updates a pet in the store with form data
export const updatePetWithForm = (
  params: { [key: string]: never },
  pathParams: {
    petId: number;
  }
) =>
  axios.request<any>({
    url: `/pet/${arguments[1].petId}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

// Deletes a pet
export const deletePet = (
  params: { [key: string]: never },
  pathParams: {
    petId: number;
  }
) =>
  axios.request<any>({
    url: `/pet/${arguments[1].petId}`,
    method: "delete",
    params: {},
    data: params,
    responseType: "json"
  });

// uploads an image
export const uploadFile = (
  params: { [key: string]: never },
  pathParams: {
    petId: number;
  }
) =>
  axios.request<ApiResponse>({
    url: `/pet/${arguments[1].petId}/uploadImage`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

// Update an existing pet
export const updatePet = (params: Pet) =>
  axios.request<any>({
    url: `/pet`,
    method: "put",
    params: {},
    data: params,
    responseType: "json"
  });

// Add a new pet to the store
export const addPet = (params: Pet) =>
  axios.request<any>({
    url: `/pet`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });

// Finds Pets by status
export const findPetsByStatus = (params: { status: "available" | "pending" | "sold" }) =>
  axios.request<Pet[]>({
    url: `/pet/findByStatus`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
/**deprecated*/
// Finds Pets by tags
export const findPetsByTags = (params: { tags: string }) =>
  axios.request<Pet[]>({
    url: `/pet/findByTags`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });
