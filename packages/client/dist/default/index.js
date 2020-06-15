"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDefaultConfig = void 0;
const template_1 = require("./template");
exports.mergeDefaultConfig = (config) => (Object.assign({ lang: 'js', templateFunction: eval(template_1.jsTemplate) }, config));
