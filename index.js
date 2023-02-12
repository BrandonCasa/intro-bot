const config = require("./config.json");
const commandHandler = require("./commands/commands.js");
const { Collection, Events, Client, GatewayIntentBits } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./newCommands').filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./newCommands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}


client.on(Events.InteractionCreate, async interaction => {
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

client.login(config.token);
