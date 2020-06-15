"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genInterface = void 0;
const genInterface = ({ name, props, skipGenerate }) => skipGenerate
    ? ''
    : ` 
    export interface ${name} {
        ${Object.entries(props).map(([propName, prop]) => `
            ${propName} ${prop.required ? '' : '?'}: ${prop.type}  ${prop.description && `// ${prop.description}`}
            `)}
      }
      `;
exports.genInterface = genInterface;
