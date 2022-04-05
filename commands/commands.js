const verifyCommand = require("./verifyCommand.js");
const reactionRoles = require("./reactionRoles.js");

function handleCommand(message, updateWaitingForReply, getWaitingForReply, client, Discord) {
  if (message.cleanContent.split("!")[1] !== undefined) {
    switch (message.cleanContent.split("!")[1].split(" ")[0]) {
      case "verify":
        verifyCommand.command(message, updateWaitingForReply, getWaitingForReply, client, null);
        break;
      case "forceverifyother":
        verifyCommand.command(message, updateWaitingForReply, getWaitingForReply, client, message.mentions.users.first());
        break;
      case "setupreactionroles":
        reactionRoles.command(message, Discord, client);
        break;
      default:
        return;
        break;
    }
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
