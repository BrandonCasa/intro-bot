function command(message) {
  message.delete();
  if (message.member.roles.cache.has("958124667380568085")) {
    message.author.send({ content: "You are already a member of INTRO." });
  } else if (message.member.roles.cache.has("958124693301391401")) {
    message.member.roles.remove("958124693301391401");
    message.member.roles.add("958124667380568085");
    message.author.send({ content: "Verification complete, you are now a member of INTRO." });
  } else if (!message.member.roles.cache.has("958124693301391401")) {
    message.member.roles.add("958124667380568085");
    message.author.send({ content: "Verification complete, you are now a member of INTRO." });
  } else {
    message.author.send({ content: "Something went wrong." });
  }
  return;
}

module.exports = { command };
