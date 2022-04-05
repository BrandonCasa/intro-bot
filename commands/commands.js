const verifyCommand = require("./verifyCommand.js");
const reactionRoles = require("./reactionRoles.js");

function handleCommand(message, updateWaitingForReply, getWaitingForReply, client, Discord) {
  let guild = client.guilds.cache.get("324216347397455873");
  let member = guild.members.cache.get(message.author.id);
  if (message.cleanContent.split("!")[1] !== undefined) {
    switch (message.cleanContent.split("!")[1].split(" ")[0]) {
      case "verify":
        verifyCommand.command(message, updateWaitingForReply, getWaitingForReply, client, null);
        break;
      case "verifyother":
        if (member.roles.cache.has("658607289074450473") || member.roles.cache.has("658644276326039572") || member.roles.cache.has("848867600360013834")) {
          verifyCommand.command(message, updateWaitingForReply, getWaitingForReply, client, message.mentions.users.first());
        }
        break;
      case "setupreactionroles":
        if (member.roles.cache.has("658607289074450473") || member.roles.cache.has("658644276326039572") || member.roles.cache.has("848867600360013834")) {
          reactionRoles.command(message, Discord, client);
        }
        break;
      default:
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
