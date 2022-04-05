const cheerio = require("cheerio");
const fs = require("fs");
const { MessageCollector } = require("discord.js");

async function reloadNames() {
  const { default: fetch } = await import("node-fetch");
  var names = [];
  for (var i = 0; i < 48; i++) {
    const fetchData = await fetch("https://robertsspaceindustries.com/api/orgs/getOrgMembers", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Opera GX";v="84"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "x-rsi-token": "18af7da5cb7e87a624b9be3503efd0a9",
        cookie:
          "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1647460740528%2Cregion:%27US%27}; moment_timezone=America%2FNew_York; Rsi-Token=18af7da5cb7e87a624b9be3503efd0a9; Rsi-XSRF=bjhDYg%3AZXkQPi%2BmR8ms7j35XS0F5g%3AIGLHjDMEIJrPCO1Eu0%2BeFw%3A1648574327809",
        Referer: "https://robertsspaceindustries.com/orgs/INTRO/members",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `{"symbol":"INTRO","search":"","pagesize":32,"page":${i}}`,
      method: "POST",
    });
    const fetchText = await fetchData.text();
    const htmlStuff = JSON.parse(fetchText).data.html;

    const $ = cheerio.load(htmlStuff);
    if ($(".name").length == 0) {
      break;
    }
    $(".name").each((index, element) => {
      names.push($(element).text());
    });
    await new Promise((r) => setTimeout(r, 500));
  }
  const d = new Date();
  names.push({ timestamp: d.getTime() + 300000 });
  await fs.writeFileSync("./names.json", JSON.stringify(names));
  return names;
}

async function verifyNames(message, updateWaitingForReply, getWaitingForReply, client) {
  var names = await fs.readFileSync("./names.json", { encoding: "utf8", flag: "r" });
  names = JSON.parse(names);
  if (names.includes(message.content)) {
    return true;
  } else {
    return false;
  }
}

async function forceVerify(message, updateWaitingForReply, getWaitingForReply, client) {
  updateWaitingForReply(message.author.id, "remove");
  var names = await fs.readFileSync("./names.json", { encoding: "utf8", flag: "r" });
  names = JSON.parse(names);
  let fetchedUser = await client.guilds.cache.get("324216347397455873").members.cache.get(message.author.id);
  const d = new Date();
  if (d.getTime() > names.slice(-1)[0].timestamp) {
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "Please hold while we cross check your username with our organization." });
    });
    names = await reloadNames();
  }

  const verified = await verifyNames(message, updateWaitingForReply, getWaitingForReply, client);
  let guild = await client.guilds.cache.get("324216347397455873"); // CHANGE THIS TO CORRECT GUILD ID
  if (verified) {
    guild.members.cache.get(fetchedUser.id).roles.remove("957382287283081296");
    guild.members.cache.get(fetchedUser.id).roles.add("957382068248146030");
    await fetchedUser.send({ content: "Verification was **successful**! You are now a member of the INTRO Discord server." });
    try {
      await guild.members.cache.get(fetchedUser.id).setNickname(`${message.content} | INTRO`);
    } catch (error) {}
    return true;
  } else {
    guild.members.cache.get(fetchedUser.id).roles.remove("957382068248146030");
    await fetchedUser.send({ content: "Verification **failed**. You either entered the wrong username, or are not a member of the organization." });
    return false;
  }
}

async function command(message, updateWaitingForReply, getWaitingForReply, client, user) {
  const { default: fetch } = await import("node-fetch");
  let guild = await client.guilds.cache.get("324216347397455873");
  let fetchedUser;
  if (user === null) {
    fetchedUser = message.author;
  } else {
    fetchedUser = guild.members.cache.get(user.id);
  }
  if (guild.members.cache.get(fetchedUser.id).roles.cache.has("957382068248146030")) {
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "Hey, you have stated that you are already a member of the INTRO organization." });
    });
  } else if (guild.members.cache.get(fetchedUser.id).roles.cache.has("957382287283081296")) {
    //message.member.roles.remove("957382287283081296");
    //message.member.roles.add("957382068248146030");
    //message.author.send({ content: "Verification complete, you are now a member of INTRO." });
    await fetchedUser.createDM().then(async (DMChannel) => {
      const userId = fetchedUser.id;
      await DMChannel.send({
        content: `
      For the verification progress to be successful, please type your **Star Citizen** username, in which you have signed up in our org.
      **The username is case sensitive. Please either copy paste or type it in precisely**.
      `,
      });
      updateWaitingForReply(userId, "add");
    });
  } else if (!guild.members.cache.get(fetchedUser.id).roles.cache.has("957382287283081296")) {
    //message.member.roles.add("957382068248146030");
    //message.author.send({ content: "Verification complete, you are now a member of INTRO." });
    await fetchedUser.createDM().then(async (DMChannel) => {
      const userId = fetchedUser.id;
      await DMChannel.send({
        content: `
      For the verification progress to be successful, please type your **Star Citizen** username, in which you have signed up in our org.
      **The username is case sensitive. Please either copy paste or type it in precisely**.
      `,
      });
      updateWaitingForReply(userId, "add");
    });
  } else {
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "Something went wrong. Please contact a moderator." });
    });
  }
  if (message.author === client.user) return;
  message.delete();
  return;
}

async function commandGuest(message, updateWaitingForReply, getWaitingForReply, client, user) {
  let guild = await client.guilds.cache.get("324216347397455873");
  let fetchedUser = guild.members.cache.get(user.id);
  const { default: fetch } = await import("node-fetch");
  if (fetchedUser.roles.cache.has("957382287283081296")) {
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "You are already a guest. If you would like to verify, please react with the checkmark." });
    });
  } else if (fetchedUser.roles.cache.has("957382068248146030")) {
    //message.member.roles.remove("957382287283081296");
    //message.member.roles.add("957382068248146030");
    //message.author.send({ content: "Verification complete, you are now a member of INTRO." });
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "Hey, you have stated that you are already a member of the INTRO organization." });
    });
  } else if (!fetchedUser.roles.cache.has("957382287283081296")) {
    //message.member.roles.add("957382068248146030");
    //message.author.send({ content: "Verification complete, you are now a member of INTRO." });
    await fetchedUser.roles.add("957382287283081296");
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "You are now a guest. You may still verify by reacting with the checkmark." });
    });
  } else {
    await fetchedUser.createDM().then(async (DMChannel) => {
      await DMChannel.send({ content: "Something went wrong. Please contact a moderator." });
    });
  }
  return;
}

module.exports = { command, forceVerify, commandGuest };
