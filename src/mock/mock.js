const fs = require("fs");
const path = require("path");
const mock = {};

fs.readdirSync(__dirname)
  .filter(file => file.endsWith(".json"))
  .forEach(file => {
    Object.assign(mock, require(path.resolve(__dirname,file)));
  });

module.exports = mock;
  