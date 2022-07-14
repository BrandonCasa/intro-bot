const config = require("./config.json");
const Discord = require("discord.js");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILDS", "GUILD_MEMBERS"],
});
let numCompleted = 0;
client.on("ready", async () => {
  console.log(`Giving all guest as ${client.user.tag}!`);
  let guild = client.guilds.cache.get("324216347397455873");
  guild.members.fetch().then(async (members) => {
    members.forEach(async (member) => {
      if (!member.user.bot) {
        if (!member.roles.cache.has("957382287283081296") && !member.roles.cache.has("957382068248146030")) {
          await member.roles.add("957382287283081296");
          console.log(`${numCompleted} Users Completed: ${member.user.tag}`);
          numCompleted++;
        }
      }
    });
  });
});
client.login(config.token);
