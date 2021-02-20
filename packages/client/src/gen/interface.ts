import { ParsedInterface } from '../..'

const genInterface = ({ name, props, skipGenerate }: ParsedInterface): string =>
  skipGenerate
    ? ''
    : `
    export interface ${name} {
        ${Object.entries(props).map(
          ([propName, prop]) =>
            `${prop.description ? `\n// ${prop.description}` : ''}
            '${propName}' ${prop.required ? '' : '?'}: ${prop.type} 
            `
        )}
      }
      `

export { genInterface }
