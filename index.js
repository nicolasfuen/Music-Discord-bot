const DiscordMusicBot = require("./structures/DiscordMusicBot");
const client = new DiscordMusicBot();

client.build();

module.exports = client; //;-;
const token = process.env['TOKEN']
client.login(token)