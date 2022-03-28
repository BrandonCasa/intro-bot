const verifyCommand = require("./verifyCommand.js");

function handleCommand(message) {
  switch (message.cleanContent.split("!")[1]) {
    case "verify":
      verifyCommand.command(message);
      break;
    default:
      return;
      break;
  }
  return;
}

module.exports = { handleCommand };
