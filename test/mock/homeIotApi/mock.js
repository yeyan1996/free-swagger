const fs = require("fs");
const mock = {};
fs.readdirSync(".")
  .filter(file => file.endsWith(".json"))
  .map(file => {
    Object.assign(mock, require(`./${file}`));
  });
exports.mock = mock;
  