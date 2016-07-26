module.exports = {
  GET_d2_match: function(mID) { return 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=' + mID + '&key=' + App.config.steamApiKey; },
  GET_d2_matchHistory: function(uID) { return 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?account_id=' + uID + '&key=' + App.config.steamApiKey; },
  GET_d2_heroes: 'http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?language=en_us&key=' + App.config.steamApiKey,
  GET_steam_resolveVanity: function(vanity) { return 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + App.config.steamApiKey + '&vanityurl=' + vanity; }
};