const verifyCommand = require("./verifyCommand.js");
const reactionRoles = require("./reactionRoles.js");

function handleCommand(message, updateWaitingForReply, getWaitingForReply, client, Discord) {
  switch (message.cleanContent.split("!")[1]) {
    case "verify":
      verifyCommand.command(message, updateWaitingForReply, getWaitingForReply, client);
      break;
    case "setupreactionroles":
      reactionRoles.command(message, Discord, client);
      break;
    default:
      return;
      break;
  }
  return;
}
function setup(client, updateWaitingForReply, getWaitingForReply) {
  reactionRoles.listen(updateWaitingForReply, getWaitingForReply, client, verifyCommand);
}

function forceVerify(message, updateWaitingForReply, getWaitingForReply, client) {
  verifyCommand.forceVerify(message, updateWaitingForReply, getWaitingForReply, client);
}

module.exports = { handleCommand, forceVerify, setup };
