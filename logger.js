const log4js = require("log4js");

log4js.configure({
  appenders: { gameOfLife: { type: "file", filename: "gameOfLife.log" } },
  categories: { default: { appenders: ["gameOfLife"], level: "info" } },
});

const logger = log4js.getLogger("gameOfLife");
module.exports = logger