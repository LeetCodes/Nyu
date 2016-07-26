module.exports = function () {
  var cm = App.commandManager;
  var kappa = {
    keyword: '!kappa',
    description: 'Le funny maymay xD',
    exec: function (payload) {
      return "Kappa " + payload.nick;
    }
  };

  var serverlist = {
    keyword: '!serverlist',
    description: 'Shows all servers the bot is connected to',
    exec: function (payload) {
      var l = App.botClient.getDiscordClient().servers;
      var res = '';
      for (var i in l)
        res += i + ' ';
      return res;
    }
  };

  var emote = {
    keyword: '!emote',
    description: 'Shows twitch emote',
    exec: function (payload) {
      App.Emotes.do(payload);
    }
  };

  var weather = {
    keyword: '!weather',
    description: 'Shows weather in specified area',
    exec: function (payload) {
      App.Weather.get(payload);
    }
  };

  var summon = {
    keyword: '!summon',
    description: 'Summons bot to the voice channel',
    exec: function (payload) {
      return App.botClient.joinChannel(payload.raw.author.voiceChannel);
    }
  };

  var randomvid = {
    keyword: '!randomvid',
    description: 'Plays random youtube video',
    exec: function (payload) {
      var needle = require('needle');
      var googleAPI = require('./api/google.js');
      var id = '';
      for (var i = 0; i < 3; i++) {
        if (Math.random() >= 0.33)
          id += String.fromCharCode(100 + Math.floor(Math.random() * 25));
        else if (Math.random() >= 0.66)
          id += String.fromCharCode(65 + Math.floor(Math.random() * 25));
        else
          id += Math.floor(Math.random() * 9);
      }

      var reqUrl = googleAPI.GET_yt_videoSearch(id);
      needle.get(reqUrl, function (err, res) {
        if (!err) {
          var item = res.body.items[Math.floor(Math.random() * res.body.items.length)];
          payload.mess = '!play https://www.youtube.com/watch?v=' + item.id.videoId;
          App.commandManager.execCommand('!play', payload);
        }
      });
    }
  };

  var server = {
    keyword: '!server',
    description: 'Returns current server object',
    exec: function (payload) {
      console.log(App.botClient.getDiscordClient().servers);
      return App.botClient.getServerObject('TINT');
    }
  };

  var skip = {
    keyword: '!skip',
    description: 'Skips playing song',
    exec: function (payload) {
      App.SongQue.skip();
    }
  };

  var reqlist = {
    keyword: '!reqlist',
    description: 'Shows song request list',
    exec: function (payload) {
      if (App.SongQue !== null) {
        var q = App.SongQue.getQueue();
        var resStr = '';
        for (var i = 0; i < q.length; i++) {
          resStr += '\n' + (i + 1) + '. ' + q[i].title;
        }
        return resStr;
      }
    }
  };

  var purgereqlist = {
    keyword: '!purgereqlist',
    description: '(Admin-only) cleans song que',
    exec: function (payload) {
      if (App.config.adminUIDs.indexOf(payload.raw.author.id) == -1) return;

      App.SongQue.emptyQue();
    }
  };

  var play = {
    keyword: '!play',
    description: 'Adds new song to queue',
    exec: function (payload) {
      if (payload.channel.name !== 'cancerbot_requests') return;

      var userVoiceChannel = payload.raw.author.voiceChannel;
      var botVoiceChannel = App.botClient.getBotUserObject().voiceChannel;

      if (userVoiceChannel === null || botVoiceChannel === null || userVoiceChannel.id !== botVoiceChannel.id)
        App.commandManager.execCommand('!summon', payload);

      try {
        App.SongQue.addToQueue(payload.parameter);
        return 'youre song has been add xDDD (' + App.SongQue.getQueue().length + ')';
      } catch (e) {
        console.log(e);
      }
    }
  };

  var exec = {
    keyword: '!exec',
    description: '(Admin-only) Executes javascript code',
    exec: function (payload) {
      if (App.config.adminUIDs.indexOf(payload.raw.author.id) == -1) return;
      try {
        /* jshint ignore:start */
        return eval(payload.parameter);
        /* jshint ignore:end */
      } catch (e) { return e; }
    }
  };

  var help = {
    keyword: '!help',
    description: 'Lists all commands',
    exec: function (payload) {
      var commands = cm.getCommands();
      var res = '\n HELP: ';
      for (var i in commands) {
        var val = commands[i];
        res += '\n' + val.keyword + ' - ' + val.description + '\n';
      }
      return res;
    }
  };

  var webshot = {
    keyword: '!webshot',
    description: 'Uploads screenshot of website',
    exec: function (payload) {
      var stream = require('webshot')(payload.parameter);
      var chunks = [];
      stream.on('data', function(data) {
        chunks.push(data);
      });

      stream.on('end', function() {
        App.botClient.sendFile(payload.raw, Buffer.concat(chunks));
      });
    }
  };

  var d2gamerep = {
    keyword: '!d2gamerep',
    description: 'Shows stats of last dota 2 game. (!d2gamerep steamcommunity.com/id/somename/)',
    exec: function (payload) {
      App.D2GameReports.get(payload);
    }
  };

  var uptime = {
    keyword: '!uptime',
    description: 'Shows how long the bot has been running.',
    exec: function() {
      var uptime_ms = new Date() - App.startTime;
      return (uptime_ms / (1000 * 60 * 60 * 24)) + " days";
    }
  };

  cm.registerCommand(kappa);
  cm.registerCommand(serverlist);
  cm.registerCommand(emote);
  cm.registerCommand(weather);
  cm.registerCommand(summon);
  cm.registerCommand(randomvid);
  cm.registerCommand(server);
  cm.registerCommand(skip);
  cm.registerCommand(reqlist);
  cm.registerCommand(purgereqlist);
  cm.registerCommand(play);
  cm.registerCommand(exec);
  cm.registerCommand(help);
  cm.registerCommand(webshot);
  cm.registerCommand(d2gamerep);
  cm.registerCommand(uptime);
};