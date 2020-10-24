const { MessageEmbed } = require("discord.js");
require("dotenv").config();

const { prefix } = process.env;

const divideInTwoColumns = (text) => {
  const half = text.indexOf("\n\n", text.length / 2);
  return [text.slice(0, half), text.slice(half)];
};

// This function triggers when somone type `<prefix>help`
const sendBotHelp = async (message) => {
  const { commands } = message.client;
  const categories = {};
  let text = "";

  // extract the command names and categories and put it in a Object
  commands.forEach(({ name, category, hidden }) => {
    if (hidden) return;
    if (categories[category] === undefined) categories[category] = [];
    categories[category].push(name);
  });

  // iterate through the object keys and concat them
  const keys = Object.keys(categories).sort();
  for (const category of keys) {
    text += `\n\n**${category}:**\n` + categories[category].join("\n");
  }

  const [column1, column2] = divideInTwoColumns(text);

  const embed = new MessageEmbed()
    .setTitle("Here's a list of all my commands:")
    .setColor(0xff5bae)
    .setThumbnail(message.client.user.avatarURL())
    .addField("_ _", column1, true)
    .addField("_ _", column2, true);

  await message.channel.send(embed);
};

// const sendCategoryHelp = () => {};

// TODO make this an nice looking embed
// This function triggers when someone type `<prefix>help <command>`
const sendCommandHelp = async (message, command) => {
  const aliases = "aliases" in command ? command.aliases : [];
  const usage = "usage" in command ? command.usage : "";
  const data =
    `${prefix} ${[command.name, ...aliases].join("|")} ${usage}\n\n` +
    command.description;

  await message.channel.send(data, { code: true, split: true });
};

module.exports = {
  description:
    "List all of my commands or info about a specific category or command.",
  aliases: ["h", "command", "commands"],
  usage: "[category/command name]",
  async execute(message, args) {
    const { commands } = message.client;

    if (!args.length) return await sendBotHelp(message);

    // TODO check if there is a category named like that

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) return message.reply("that's not a valid command!");

    await sendCommandHelp(message, command);
  },
};
