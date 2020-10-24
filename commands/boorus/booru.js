const Booru = require("booru");
const { shuffle } = require("booru/dist/Utils");
const { MessageEmbed } = require("discord.js");

let siteTagList = {};
const sites = {
  "e621.net": ["e6", "e621"],
  "e926.net": ["e9", "e926"],
  "hypnohub.net": ["hh", "hypno", "hypnohub"],
  "danbooru.donmai.us": ["db", "dan", "danbooru"],
  "konachan.com": ["kc", "konac", "kcom"],
  "konachan.net": ["kn", "konan", "knet"],
  "yande.re": ["yd", "yand", "yandere"],
  "gelbooru.com": ["gb", "gel", "gelbooru"],
  "rule34.xxx": ["r34", "rule34"],
  "safebooru.org": ["sb", "safe", "safebooru"],
  "tbib.org": ["tb", "tbib", "big"],
  "xbooru.com": ["xb", "xbooru"],
  "rule34.paheal.net": ["pa", "paheal"],
  "derpibooru.org": ["dp", "derp", "derpi", "derpibooru"],
  "furry.booru.org": ["fb", "furrybooru"],
  "realbooru.com": ["rb", "realbooru"],
};

const getPosts = async (site, tags) => {
  if (
    siteTagList[site] &&
    siteTagList[site][tags] &&
    siteTagList[site][tags].length
  )
    return;

  await Booru.search(site, tags, { limit: 100, random: true })
    .then((posts) => {
      if (!posts.length) return;
      if (!siteTagList[site]) siteTagList[site] = {};
      siteTagList[site][tags] = [];
      siteTagList[site][tags].push(...posts);
      shuffle(siteTagList[site][tags]);
    })
    .catch((error) => console.log(error));
};

module.exports = {
  description: "Search a random image from one of the 17 available boorus site",
  aliases: ["b"],
  usage: "<site name> <tags>",
  async execute(message, args) {
    if (!args.length) {
      const text = Object.keys(sites).map((site) => `${site}: ${sites[site]}`);
      await message.channel.send(
        "Please specify a site! Available choices:\n" + text.join("\n")
      );
      return;
    }

    args = args.join(" ").toLowerCase().split(" ");
    const site = args[0];
    const tags = args.slice(1).sort().join(" ");

    message.channel.startTyping();
    await getPosts(site, tags);
    if (!siteTagList[site][tags])
      return await message.channel.send(
        "I couldn't find any image with those tags!"
      );

    const post = siteTagList[site][tags].pop();

    const embed = new MessageEmbed()
      .setColor(0xf1c40f)
      .setTitle("sauce")
      .setURL(post.postView)
      .setImage(post.fileUrl)
      .setFooter(`${post.score}⬆️ created at: ${post.createdAt}`);

    message.channel.send(embed);
  },
};
