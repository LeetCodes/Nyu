var ytdl = require('ytdl-core');

function main(url) {
  var currentStream = null;
  var audioContext = App.botClient.getAudioContext();
  var onEndFunc = null;

  this.setOnEnd = function (callback) {
    onEndFunc = callback;
  };

  var ytdlStream = null;
  try {
    ytdlStream = ytdl(url, {audioonly: true});
  } catch (e) { console.log(e); }

  ytdlStream.on('error', function(e) {
    onEndFunc();
  });

  ytdlStream.on('end', function () {
    onEndFunc();
  });

  // So discord.js encodes the data stream for me with ffmpeg. Sweet!
  if(audioContext)
    audioContext.playRawStream(ytdlStream, { volume: App.voiceVolume }); else onEndFunc();

  this.release = function () {
    audioContext.stopPlaying();
    ytdlStream.destroy();
  };
}

module.exports = main;
