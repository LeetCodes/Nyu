module.exports = function () {
  var Player = require('./Player.js');
  var ytdl = require('ytdl-core');
  var needle = require('needle');
  var googleAPI = require('../../api/google.js');
  var messageListeners = [];
  var queue = [];
  var currentPlayingSong = null;
  var time = 1;

  this.onMessage = function (callback) {
    messageListeners.push(callback);
  };

  this.addToQueue = function (param) {
    if (param.indexOf('playlist') != -1) {
      parsePlaylist(param);
      return;
    }

    if (param.indexOf('https') === -1) {
      searchVideo(param);
      return;
    }

    ytdl.getInfo(param, {}, function (err, data) {
      queue.push({ title: data.title, url: param });
    });
  };

  this.skip = function () {
    if (currentPlayingSong !== null)
      endSong();
  };

  this.getQueue = function () {
    return queue;
  };

  this.emptyQue = function () {
    queue = [];
  };

  function searchVideo(query) {
    var reqUrl = googleAPI.GET_yt_videoSearch(query);
    needle.get(reqUrl, function (err, res) {
      if (!err) {
        if (res.body.items.length === 0) return;
        var item = res.body.items[0];
        var url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
        queue.push({ title: item.snippet.title, url: url });
      }
    });
  }

  function parsePlaylist(playlistUrl) {
    var reqUrl = googleAPI.GET_yt_playlist(playlistUrl.split('=')[1]);
    needle.get(reqUrl, function (err, res) {
      if (!err) {
        var obj = res.body;
        for (var i = 0; i < obj.items.length; i++) {
          var currentItem = obj.items[i];
          var url = 'https://www.youtube.com/watch?v=' + currentItem.snippet.resourceId.videoId;
          queue.push({ title: currentItem.snippet.title, url: url });
        }
      }
    });
  }

  function sendMessage(content) {
    for (var i = 0; i < messageListeners.length; i++)
      messageListeners[i](content);
  }

  function endSong() {
    time = 0;
    App.botClient.setStatus('Nothing!');
    if (currentPlayingSong !== null)
      currentPlayingSong.release();
    currentPlayingSong = null;
  }

  function play(obj) {
    try {
      // Change title
      App.botClient.setStatus(obj.title);
      currentPlayingSong = new Player(obj.url);
      currentPlayingSong.setOnEnd(endSong);
    } catch (e) { console.log(e); }
  }

  function timer() {
    time++;
    if (time >= 1 && currentPlayingSong === null) {
      if (queue.length === 0) return;
      play(queue[0]);
      queue.shift();
    }
  }

  setInterval(timer, 1000);
};