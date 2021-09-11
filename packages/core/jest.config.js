module.exports = {
    "globals": {
        "__DEV__": true
    },
    transform: {
        // 将.js后缀的文件使用babel-jest处理
        "^.+\\.js$": "babel-jest",
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
}
