module.exports = {
  hidden: true,
  isOwner: true,
  execute(message, args) {
    message.client.user.setActivity(args);
  },
};
