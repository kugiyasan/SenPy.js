const fs = require("fs");
const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client();
const prefix = process.env.prefix;
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const getCommandByName = (commandName) =>
  client.commands.get(commandName) ||
  client.commands.find(
    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
  );

// check if the message starts with the command prefix or a mention
const isInvoked = (message) =>
  (message.content.startsWith(prefix) ||
    message.content.startsWith(`<@!${client.user.id}>`)) &&
  !message.author.bot;

const parseMessage = (message) => {
  // if not starting with the prefix, the bot has been tagged
  const prefixLength = message.content.startsWith(prefix)
    ? prefix.length
    : 4 + client.user.id.length;

  const args = message.content.slice(prefixLength).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = getCommandByName(commandName);

  return [command, args];
};

const canRun = async (args, message, command) => {
  if (!command) return false;

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage)
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;

    await message.channel.send(reply);
    return false;
  }

  if (command.guildOnly && message.channel.type !== "text") {
    await message.reply("I can't execute that command inside DMs!");
    return false;
  }

  if (
    command.isOwner &&
    message.author.id !== (await client.fetchApplication()).owner.id
  )
    return false;

  // if (await onCooldown(message, command)) return false;

  return true;
};

/*
const onCooldown = async (message, command) => {
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      await message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
      return true;
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
};
*/

const onCommandError = async (message, error, command) => {
  console.error(error);
  let reply = "There was an unexpected error, I'll inform the bot dev, sorry~~";
  await message.channel.send(reply);

  let guild = "";
  if (message.guild) guild = `from ${message.guild.name} `;

  const { owner } = await client.fetchApplication();
  reply =
    `${message.author} ${guild}raised an error with ***${command.name}***\n` +
    "```" +
    error +
    "```";
  await owner.send(reply);
};

const loadCommands = (directory = "./commands") =>
  fs.readdirSync(directory, { withFileTypes: true }).forEach((element) => {
    if (element.isDirectory())
      return loadCommands(`${directory}/${element.name}`);

    const file = element.name;
    if (!file.endsWith(".js")) return;

    const command = require(`${directory}/${file}`);
    // category is the name of the folder in which the command is
    command.category = directory.match(/(?<=\/)[^\/]+$/)[0];
    command.directory = directory;

    // check if there is already a command with the same name or alias
    if (
      getCommandByName(command.name) ||
      (command.aliases &&
        command.aliases.some((name) => getCommandByName(name)))
    )
      throw `${command.name} or one of its aliases is already registered!`;

    client.commands.set(command.name, command);
  });

client.once("ready", () => {
  console.log(
    `Logged in as ${client.user.tag} on ${client.guilds.cache.size} servers`
  );
  client.user.setActivity(`${prefix} help | ${prefix} about`);
});

client.on("message", async (message) => {
  if (!isInvoked(message)) return;

  const [command, args] = parseMessage(message);

  if (!canRun(args, message, command)) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    await onCommandError(message, error, command);
  }
});

loadCommands();
client.login(process.env.DISCORD_TOKEN);
