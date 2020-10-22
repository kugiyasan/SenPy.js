module.exports = {
  name: "activity",
  execute(message, args) {
    message.client.user.setActivity(args);
  }
}