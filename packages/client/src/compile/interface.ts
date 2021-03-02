import { CompileTypes, compileTypes } from './type'

// 生成全量/部分 interface 代码
const compileInterfaces: CompileTypes = (args) =>
  compileTypes({
    ...args,
    type: 'interface',
  })

export { compileInterfaces }
