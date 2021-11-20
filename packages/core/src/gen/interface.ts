import { ParsedInterface } from '../..'

const genInterface = ({
  formatName,
  props,
  code,
  description,
}: ParsedInterface): string =>
  code
    ? code
    : `${
        description ? `/** ${description} */\n` : ''
      }export interface ${formatName} {
        ${
          props &&
          Object.entries(props).map(
            ([propName, prop]) =>
              `${prop.description ? `\n/** ${prop.description} */` : ''}
            '${propName}' ${prop.required ? '' : '?'}: ${prop.formatType}
            `
          )
        }
      }
`

export { genInterface }
