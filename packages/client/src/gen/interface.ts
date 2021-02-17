import { ParsedInterface } from '../..'

const genInterface = ({
  formatName,
  props,
  code,
}: Required<ParsedInterface>): string =>
  code
    ? code
    : `
    export interface ${formatName} {
        ${Object.entries(props).map(
          ([propName, prop]) =>
            `
            '${propName}' ${prop.required ? '' : '?'}: ${prop.formatType}  ${
              prop.description && `// ${prop.description}`
            }
            `
        )}
      }
      `

export { genInterface }
