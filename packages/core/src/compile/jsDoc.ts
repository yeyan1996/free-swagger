import { CompileTypes, compileTypes } from './type'

// 生成全量/部分 jsDoc type 代码
const compileJsDocTypedefs: CompileTypes = (arg) =>
  compileTypes({
    ...arg,
    type: 'jsDoc',
  })

export { compileJsDocTypedefs }
