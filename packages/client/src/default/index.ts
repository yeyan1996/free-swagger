import { ClientConfig } from '../utils'
import { jsTemplate } from './template'

export const mergeDefaultParams = (
  config: ClientConfig
): Required<ClientConfig> => ({
  useJsDoc: false,
  lang: 'js',
  templateFunction: eval(jsTemplate),
  ...config,
})
