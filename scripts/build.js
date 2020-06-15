const {execSync} = require("child_process")
const fs = require("fs")
const path = require("path")

const files = fs.readdirSync(path.resolve(__dirname,'../packages'))
files.forEach(file => {
    execSync(`tsc`,{
        cwd: path.resolve(__dirname,'../packages',file),
        stdio:"inherit"
    })
})
