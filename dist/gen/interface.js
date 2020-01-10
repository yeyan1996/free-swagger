"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const genInterfaces = (interfaces) => Object.entries(interfaces)
    .map(([name, props]) => utils_1.formatCode(` 
    export interface ${name} {
        ${Object.entries(props).map(([propName, prop]) => `
            ${propName} ${prop.required ? "" : "?"}: ${prop.type}  ${prop.description && `// ${prop.description}`}
            `)}
      }
      `))
    .reduce((acc, cur) => acc + cur);
exports.genInterfaces = genInterfaces;
