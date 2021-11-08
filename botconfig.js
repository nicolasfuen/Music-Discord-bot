module.exports = {
  Admins: ["UserID", "UserID"], 
  ExpressServer: true, 
  DefaultPrefix: process.env.Prefix || "m1!", 
  Port: 3000, 
  SupportServer: "https://discord.gg/nfBXFgnQPF", 
  Token: process.env.Token || "NzkxMDY4OTE5NTE0NzkxOTQ5.X-JyVw.s2tgkBwEgr1NJcHaA3l8dL-OSWk", 
  ClientID: process.env.Discord_ClientID || "791068919514791949", 
  ClientSecret: process.env.Discord_ClientSecret || "8kZcFQIkZHzK-ufYe3uZyEnlMvrypWeB", 
  Scopes: ["identify", "guilds", "applications.commands"],
  ServerDeafen: true, 
  DefaultVolume: 100, 
  CallbackURL: "/api/callback", 
  "24/7": false, 
  CookieSecret: "Pikachu is cute",
  IconURL:
    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif", 
  EmbedColor: "RANDOM", 
  Permissions: 2205281600,
  Website: process.env.Website || "https://Music-Discord-Bot.nicolasfue.repl.co",

  
  Lavalink: {
    id: "Main",
    host: "lava.link",
    port: 80, 
    pass: "(password)",
    secure: false, 
  },

 
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "cb1fcec1730b425cb7082a5589dcc3c0", 
    ClientSecret: process.env.Spotify_ClientSecret || "5e84b335a6174c008c9e70087f6d98f7", 
  },
};
