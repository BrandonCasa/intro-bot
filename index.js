const config = require("./config.json");
const commandHandler = require("./commands/commands.js");
const Discord = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

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

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILDS", "GUILD_MEMBERS"],
});

const commands = [];
const commandFiles = fs.readdirSync('./newCommands').filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./newCommands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}


client.on(Discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  commandHandler.setup(client, updateWaitingForReply, getWaitingForReply);
  const rest = new Discord.REST({ version: '10' }).setToken(config.token);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Discord.Routes.applicationCommands(config.clientID),
        { body: commands },
      );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
});

client.on("messageCreate", async (message) => {
  if (waitingForReply.includes(message.author.id)) {
    commandHandler.forceVerify(message, updateWaitingForReply, getWaitingForReply, client);
  } else {
    if (!message.cleanContent.startsWith("!")) return;
  }

  commandHandler.handleCommand(message, updateWaitingForReply, getWaitingForReply, client, Discord);
});

client.login(config.token);
