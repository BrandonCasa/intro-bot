const verifyCommand = require("./verifyCommand.js");

function handleCommand(message, updateWaitingForReply, getWaitingForReply, client) {
  switch (message.cleanContent.split("!")[1]) {
    case "verify":
      verifyCommand.command(message, updateWaitingForReply, getWaitingForReply, client);
      break;
    default:
      return;
      break;
  }
  return;
}

function forceVerify(message, updateWaitingForReply, getWaitingForReply, client) {
  verifyCommand.forceVerify(message, updateWaitingForReply, getWaitingForReply, client);
}

module.exports = { handleCommand, forceVerify };
