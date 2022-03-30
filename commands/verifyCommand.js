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
  let fetchedUser = await client.guilds.cache.get("840773742560018443").members.cache.get(message.author.id);
  const d = new Date();
  console.log(names, d.getTime());
  if (d.getTime() > names.slice(-1)[0].timestamp) {
    await fetchedUser.send({ content: "Reloading members list, please hold..." });
    names = await reloadNames();
  }

  const verified = await verifyNames(message, updateWaitingForReply, getWaitingForReply, client);
  let guild = await client.guilds.cache.get("840773742560018443"); // CHANGE THIS TO CORRECT GUILD ID
  if (verified) {
    guild.members.cache.get(message.author.id).roles.remove("958124693301391401");
    guild.members.cache.get(message.author.id).roles.add("958124667380568085");
    fetchedUser.send({ content: "Verification complete, you are now a member of INTRO." });
    return true;
  } else {
    guild.members.cache.get(message.author.id).roles.remove("958124667380568085");
    fetchedUser.send({ content: "Verification failed, you are NOT a member of INTRO. If you input the wrong username, please retry the command." });
    return false;
  }
}

async function continueVerification(message, updateWaitingForReply, getWaitingForReply, client) {
  const userId = message.author.id;
  await message.author.send({ content: "What is your username on Star Citizen? (must be exact)" });
  updateWaitingForReply(userId, "add");
  return;
}

async function command(message, updateWaitingForReply, getWaitingForReply, client) {
  const { default: fetch } = await import("node-fetch");
  message.delete();
  if (message.member.roles.cache.has("958124667380568085")) {
    let fetchedUser = await client.guilds.cache.get("840773742560018443").members.cache.get(message.author.id);
    fetchedUser.send({ content: "You are already a member of INTRO." });
  } else if (message.member.roles.cache.has("958124693301391401")) {
    //message.member.roles.remove("958124693301391401");
    //message.member.roles.add("958124667380568085");
    //message.author.send({ content: "Verification complete, you are now a member of INTRO." });
    await continueVerification(message, updateWaitingForReply, getWaitingForReply, client);
  } else if (!message.member.roles.cache.has("958124693301391401")) {
    //message.member.roles.add("958124667380568085");
    //message.author.send({ content: "Verification complete, you are now a member of INTRO." });
    await continueVerification(message, updateWaitingForReply, getWaitingForReply, client);
  } else {
    let fetchedUser = await client.guilds.cache.get("840773742560018443").members.cache.get(message.author.id);
    fetchedUser.send({ content: "Something went wrong." });
  }
  return;
}
module.exports = { command, forceVerify };
