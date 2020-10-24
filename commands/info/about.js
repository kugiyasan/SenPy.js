const { MessageEmbed } = require("discord.js");

module.exports = {
  description: "gives various informations about the bot",
  aliases: ["credit", "credits", "invite"],
  async execute(message, args) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=268827712`;
    const servers = message.client.guilds.cache.size;
    const userCount = message.client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    );

    const contributors = [
      "502588820051591190",
      "534267874794143745",
      "256149662979850251",
      "230702257480400896",
    ]
      .map((id) => message.client.users.cache.get(id))
      .join("\n");

    const embed = new MessageEmbed()
      .setTitle("Click here to invite me on your server!")
      .setURL(inviteLink)
      .setDescription("SenPy.js is written in JavaScript with discord.js")
      .addField(
        `Running on ${servers} servers`,
        "Share this bot to increase this number!",
        true
      )
      .addField(
        `Serving ${userCount} users`,
        `Technically it's {realUsersCount} if you don't count bots and duplicated users but who cares`,
        true
      )
      .addField(
        "Github repository (not the right one)",
        "https://github.com/kugiyasan/SenPy",
        true
      )
      .addField("Owner", (await message.client.fetchApplication()).owner, true)
      .addField("Bot ID", message.client.user.id, true)
      .addField("Uptime", `${message.client.uptime / 1000} s`, true)
      .addField("Latency", `${Math.round(message.client.ws.ping)} ms`, true)
      .addField("Contributors", contributors, true)
      .addField("Support server", "https://discord.gg/axTWGsc", true)
      .addField("You have some feedback?", "Use xd report", true);

    await message.channel.send(embed);
  },
};
