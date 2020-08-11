import { ParsedInterface } from '../..'

const genInterface = ({ name, props, skipGenerate }: ParsedInterface): string =>
  skipGenerate
    ? ''
    : ` 
    export interface ${name} {
        ${Object.entries(props).map(
          ([propName, prop]) =>
            `
            ${propName} ${prop.required ? '' : '?'}: ${prop.type}  ${
              prop.description && `// ${prop.description}`
            }
            `
        )}
      }
      `

export { genInterface }
