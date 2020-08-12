// format 不规范的 json
export default (string)=> {
    let globalObj = {}
    let resObj
    try {
        resObj = JSON.parse(string)
        return resObj
    } catch {
        string = 'globalObj.$JSON = ' + string
        eval(string)
        return globalObj.$JSON
    }
    throw new Error('Your JSON FORMAT IS TOO STRANGER')
}

