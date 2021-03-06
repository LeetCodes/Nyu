// Global object
GLOBAL.App = {};
App.voiceVolume = 0.1;

var Client = require('./Client.js');
var CommandManager = require('./CommandManager.js');
var SongQue = require('./commands/songrequests/SongQueue.js');
var WeatherQuery = require('./commands/weather.js');
var EmoteQuery = require('./commands/emotes.js');
var commands = require('./Commands.js');
var Dota2GameReport = require('./commands/dota2gamereport.js');

require('fs').readFile('creds', 'utf8', function (err, data) {
  App.config = JSON.parse(data);
  init();
});

// I'm lazy
process.on('uncaughtException', function (err) {
  if (err.code == 'ECONNRESET') {
    console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
    console.log(err.stack);
    return;
  }

  console.log(err);
  console.log(err.stack);
});

process.on('exit', function () {
  App.botClient.getDiscordClient().destroy();
});

process.on('SIGINT', function () {
  process.exit();
});

//--------------------------------------

function init() {

  // Init some shit
  App.botClient = new Client();
  App.commandManager = new CommandManager();
  App.SongQue = new SongQue();
  App.Weather = new WeatherQuery();
  App.Emotes = new EmoteQuery();
  App.D2GameReports = new Dota2GameReport();
  App.startTime = new Date();

  // Create commands
  commands();
}
