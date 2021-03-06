function CommandManager() {
  var commands = {};

  this.registerCommand = function (command) {
    commands[command.keyword] = command;
  };

  this.getCommands = function () {
    return commands;
  };

  this.execCommand = function (keyword, payload) {
    App.botClient.sendMessage(payload.raw, commands[keyword].exec(payload));
  };

  App.botClient.addMessageListener(function (user, userID, channel, message, rawEvent) {
    var response = "";
    try {
      var parsedMessage = message.split(' ');
      var a = message.split(' ');
      a.shift();
      var payload = {
        nick: user,
        userID: userID,
        channel: channel,
        mess: message,
        parameter: a.join(' '),
        raw: rawEvent
      };
      if (parsedMessage[0] in commands)
        response = commands[parsedMessage[0]].exec(payload);
      else return;
    } catch (e) {
      response = e;
    }
    if (response !== undefined)
      App.botClient.sendMessage(rawEvent, response);
  });
}

module.exports = CommandManager;
