const fs = require("fs");
module.exports = {
  async command(message, Discord, client) {
    const verifyEmoji = "✅";
    const crossEmoji = "❎";

    let embed = new Discord.MessageEmbed()
      .setColor("#3492eb")
      .setTitle("Welcome and Verification")
      .setDescription(
        `
      Hey, and welcome to the *INTRO Discord* server! We hope you have read and accepted our rules and terms.

      As per verification, we would like to know if you are already a member of the *INTRO* organization. **This is not required to join the Discord server.**

      You are a member of *INTRO* if you are connected to our *Star Citizen* org. (https://robertsspaceindustries.com/orgs/intro)
      
      If so, please verify yourself by clicking the checkmark button. :white_check_mark:  (Our verification bot will send you a DM, asking for your *Star Citizen* name)
      If not, please click the cross button. :negative_squared_cross_mark:  (You will be given the *INTRO Guest* role with access to our server)

      Have a happy stay!
      If you run in to any problems whatsoever, please contact one of our Moderators.

      @Junior Moderator 
      @Moderators 


      With kind regards,
      The INTRO Executive Board
      `
      )
      .setThumbnail("https://cdn.discordapp.com/icons/324216347397455873/a2244ff39b9e6445d8a26588cbbb394b.webp");

    let messageEmbed = await message.channel.send({ embeds: [embed] });
    await fs.writeFileSync("./embed-id.txt", `${messageEmbed.id},${messageEmbed.channel.id}`);
    await messageEmbed.react(verifyEmoji);
    await messageEmbed.react(crossEmoji);
  },
  async listen(updateWaitingForReply, getWaitingForReply, client, verifyCommand) {
    const channel = "957393541456363570";
    client.on("messageReactionAdd", async (reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;

      if (reaction.message.channel.id == channel) {
        if (reaction.emoji.name === "✅") {
          await verifyCommand.command(reaction.message, updateWaitingForReply, getWaitingForReply, client, user);
          var embedIDs = await fs.readFileSync("./embed-id.txt", { encoding: "utf8", flag: "r" });
          var theChannel = await client.channels.fetch(embedIDs.split(",")[1]);
          var theMessage = await theChannel.messages.fetch(embedIDs.split(",")[0]);
          const userReactions = theMessage.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));

          try {
            for (const reaction of userReactions.values()) {
              await reaction.users.remove(user.id);
            }
          } catch (error) {
            console.error("Failed to remove reactions.");
          }
        } else if (reaction.emoji.name === "❎") {
          await verifyCommand.commandGuest(reaction.message, updateWaitingForReply, getWaitingForReply, client, user);
          var embedIDs = await fs.readFileSync("./embed-id.txt", { encoding: "utf8", flag: "r" });
          var theChannel = await client.channels.fetch(embedIDs.split(",")[1]);
          var theMessage = await theChannel.messages.fetch(embedIDs.split(",")[0]);
          const userReactions = theMessage.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));

          try {
            for (const reaction of userReactions.values()) {
              await reaction.users.remove(user.id);
            }
          } catch (error) {
            console.error("Failed to remove reactions.");
          }
        }
      } else {
        return;
      }
    });
  },
};
