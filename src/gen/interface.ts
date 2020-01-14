import { formatCode } from "../client/utils";
import { InterfaceCollection } from "../parse/interface";

const genInterfaces = (interfaces: InterfaceCollection): string =>
  Object.entries(interfaces)
    .map(([name, props]) =>
      formatCode(` 
    export interface ${name} {
        ${Object.entries(props).map(
          ([propName, prop]) =>
            `
            ${propName} ${prop.required ? "" : "?"}: ${
              prop.type
            }  ${prop.description && `// ${prop.description}`}
            `
        )}
      }
      `)
    )
    .reduce((acc: string, cur: string) => acc + cur);

export { genInterfaces };
