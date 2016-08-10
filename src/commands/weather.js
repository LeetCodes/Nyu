module.exports = function () {
  var needle = require('needle');
  var yahooAPI = require('../api/yahoo.js');

  this.get = function (msgPayload) {
    try {
      query(msgPayload.parameter, msgPayload.raw);
    } catch (e) {
      returnMessage(msgPayload.raw, 'Could not parse city');
    }
  };

  function query(location, rawEvent) {
    needle.get(yahooAPI.GET_weather(location), function (err, res) {
      if (err) {
        returnMessage(rawEvent, 'Error ' + err);
        return;
      }

      if (!res.body.query || res.body.query.results === null) {
        returnMessage(rawEvent, 'Invalid request.');
        return;
      }
      var obj = res.body.query.results.channel;
      var title = '\n' + obj.title;
      var wind = '\n' + Math.round(obj.wind.speed / 3.6) + 'm/s | ' + obj.wind.direction + '°';
      obj = res.body.query.results.channel.item;
      var weather = '\n' + obj.condition.date + ' \n\n ' + obj.condition.temp + '°C  ' + obj.condition.text + '\n\n';
      var forecastTitle = '\n\nFORECAST:\n';
      var forecast = '';
      for (var i = 0; i < obj.forecast.length; i++) {
        var condition = obj.forecast[i];
        forecast += '\n' + condition.day + ', ' + condition.date + '    ' + condition.low + ' - ' + condition.high + '°C   ' + condition.text;
      }

      returnMessage(rawEvent, title + weather + wind + forecastTitle + forecast);

    });
  }

  function returnMessage(rawEvent, content) {
    App.botClient.sendMessage(rawEvent, content);
  }
};