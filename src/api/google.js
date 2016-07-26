module.exports = {
  GET_yt_playlist: function(plID) { return 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + plID + '&maxResults=50&key=' + App.config.googleApiKey; },
  GET_yt_videoSearch: function(query) { return 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + query + '&type=video&key=' + App.config.googleApiKey;  }
};