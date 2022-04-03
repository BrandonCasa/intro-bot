module.exports = {
  async command(message, Discord, client) {
    const verifyEmoji = "✅";

    let embed = new Discord.MessageEmbed()
      .setColor("#e42643")
      .setTitle("Verify Your Star Citizen Handle.")
      .setDescription("Upon clicking the green checkmark, you will be DM'd and asked to input your SC handle.");

    let messageEmbed = await message.channel.send({ embeds: [embed] });
    await messageEmbed.react(verifyEmoji);
  },
  async listen(updateWaitingForReply, getWaitingForReply, client, verifyCommand) {
    const channel = "958115126433693726";
    client.on("messageReactionAdd", async (reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;

      if (reaction.message.channel.id == channel) {
        if (reaction.emoji.name === "✅") {
          await verifyCommand.commandSpecial(reaction.message, updateWaitingForReply, getWaitingForReply, client, user);
        }
      } else {
        return;
      }
    });
  },
};
