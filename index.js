const config = require("./config.json");
const commandHandler = require("./commands/commands.js");
const { Client, Intents } = require("discord.js");

const waitingForReply = [];
function updateWaitingForReply(userId, type) {
  switch (type) {
    case "add":
      if (!waitingForReply.includes(userId)) {
        waitingForReply.push(userId);
      }
      break;
    case "remove":
      if (waitingForReply.includes(userId)) {
        waitingForReply.splice(waitingForReply.indexOf(userId), 1);
      }
      break;
    default:
      break;
  }
  return waitingForReply;
}
function getWaitingForReply() {
  return waitingForReply;
}

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILDS", "GUILD_MEMBERS"],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (waitingForReply.includes(message.author.id)) {
    commandHandler.forceVerify(message, updateWaitingForReply, getWaitingForReply, client);
  } else {
    if (!message.cleanContent.startsWith("!")) return;
  }

  commandHandler.handleCommand(message, updateWaitingForReply, getWaitingForReply, client);
});

client.login(config.token);
