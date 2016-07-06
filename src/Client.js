var Discord = require('discord.js');
function Client(credentials) {
  var options = {
    autoReconnect: true
  };
  var cli = new Discord.Client(options);
  cli.loginWithToken(App.credentials[3]);
  var messageListeners = [];

  this.joinChannel = function (voiceChannel) {
    if (voiceChannel) {
      cli.joinVoiceChannel(voiceChannel);
      return '';
    } else return 'error joining channel';
  };

  this.getAudioContext = function () {
    return cli.voiceConnection;
  };

  this.addMessageListener = function (func) {
    messageListeners.push(func);
  };

  this.sendMessage = function (rawEvent, message) {
    if(message.length === 0) return;
    cli.sendMessage(rawEvent, '```' + message + '```');
  };

  this.sendFile = function (rawEvent, file) {
    cli.sendFile(rawEvent, file);
  };

  this.reply = function (rawEvent, message) {
    cli.reply(rawEvent, message);
  };

  this.getBotUserObject = function () {
    return cli.user;
  };

  this.getServerObject = function (name) {
    for (var i = 0; i < cli.servers.length; i++)
      if (cli.servers[i].name === name)
        return cli.servers[i];
    return null;
  };

  this.setStatus = function (status) {
    cli.setPlayingGame(status);
  };

  this.getDiscordClient = function () {
    return cli;
  };

  cli.on('ready', function () {
    console.log(cli.user.username + ' - (' + cli.user.id + ')');
  });

  cli.on('message', function (msg) {
    // Only emit commands.
    if (msg.content.indexOf("!") != -1) {
      for (var i = 0; i < messageListeners.length; i++) {
        messageListeners[i](msg.author.username, msg.author.id, msg.channel, msg.content, msg);
      }
    }
  });

  cli.on('disconnected', function () {
    console.log("Disconnected, reconnecting...");
  });
}

module.exports = Client;
