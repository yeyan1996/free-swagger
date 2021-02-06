import inquirer from 'inquirer'
import { omit, isFunction } from 'lodash'

export const prompt = async (questions: any[]) => {
  const results: Record<string, any> = {}
  for (const question of questions) {
    const condition = question.when
    if (condition && !condition(results)) {
      continue
    }
    const normalizeQuestion = omit(question, 'when')
    if (isFunction(normalizeQuestion.default)) {
      normalizeQuestion.default = normalizeQuestion.default(results)
    }
    const answer = (await inquirer.prompt(normalizeQuestion)) as Record<
      string,
      any
    >
    results[question.name] = answer[question.name]
    await question.callback?.(answer[question.name], results)
  }
  return results
}
