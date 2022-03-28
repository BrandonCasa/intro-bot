const config = require("./config.json");
const commandHandler = require("./commands/commands.js");
const { Client, Intents } = require("discord.js");
const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILDS", "GUILD_MEMBERS"],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (!message.cleanContent.startsWith("!")) return;

  commandHandler.handleCommand(message);
});

client.login(config.token);
