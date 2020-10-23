const fs = require("fs");
const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client();
const prefix = process.env.prefix;
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// load the commands
const directories = ["./commands", "./commands/info"];
const commandFiles = [];
for (const directory of directories) {
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".js"));

  for (file of files) {
    const command = require(`${directory}/${file}`);
    command.directory = directory;
    client.commands.set(command.name, command);
  }
  commandFiles.push(...files);
}

client.once("ready", () => {
  console.log(
    `Logged in as ${client.user.tag} on ${client.guilds.cache.size} servers`
  );
  client.user.setActivity(`${prefix} help | ${prefix} about`);
});

client.on("message", async (message) => {
  // TODO check if mentionned
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const [args, command] = parseMessage(message);

  if (!canRun(args, message, command)) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    await onCommandError(message, error, command);
  }
});

const parseMessage = (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  return [args, command];
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

  if (await onCooldown(message, command)) return false;

  return true;
};

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

client.login(process.env.DISCORD_TOKEN);
