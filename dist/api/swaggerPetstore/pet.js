"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Find pet by ID
exports.getPetById = (params, pathParams) => axios_1.default.request({
    url: `/pet/${arguments[1].petId}`,
    method: "get",
    responseType: "json"
});
// Updates a pet in the store with form data
exports.updatePetWithForm = (params, pathParams) => axios_1.default.request({
    url: `/pet/${arguments[1].petId}`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
// Deletes a pet
exports.deletePet = (params, pathParams) => axios_1.default.request({
    url: `/pet/${arguments[1].petId}`,
    method: "delete",
    responseType: "json"
});
// uploads an image
exports.uploadFile = (params, pathParams) => axios_1.default.request({
    url: `/pet/${arguments[1].petId}/uploadImage`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
// Update an existing pet
exports.updatePet = (params) => axios_1.default.request({
    url: `/pet`,
    method: "put",
    responseType: "json",
    params: {},
    data: params
});
// Add a new pet to the store
exports.addPet = (params) => axios_1.default.request({
    url: `/pet`,
    method: "post",
    responseType: "json",
    params: {},
    data: params
});
// Finds Pets by status
exports.findPetsByStatus = (params) => axios_1.default.request({
    url: `/pet/findByStatus`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
});
/**deprecated*/
// Finds Pets by tags
exports.findPetsByTags = (params) => axios_1.default.request({
    url: `/pet/findByTags`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
});
