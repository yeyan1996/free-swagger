import { ParsedInterface } from '../..'

const genInterface = (
  { name, props, skipGenerate }: ParsedInterface,
  propComment = 'tail'
): string =>
  skipGenerate
    ? ''
    : `
    export interface ${name} {
        ${Object.entries(props).map(([propName, prop]) => {
          const { description, required, type } = prop
          let headComment = ''
          let tailComment = ''
          if (description && propComment) {
            if (propComment === 'head') {
              headComment = `// ${description}\n`
            } else if (propComment === 'tail') {
              tailComment = ` // ${description}`
            }
          }

          const requireMark = required ? '' : '?'
          return `
            ${headComment}'${propName}' ${requireMark}: ${type}${tailComment}
          `
        })}
      }
      `

export { genInterface }
