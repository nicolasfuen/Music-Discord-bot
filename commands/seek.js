const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "seek",
  description: "Busca una posición en la canción.",
  usage: "<time s/m/h>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["forward"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nada está sonando en este momento ...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **¡Debe estar en un canal de voz para usar este comando!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **¡Debes estar en el mismo canal de voz que yo para usar este comando!**"
      );
    if (!player.queue.current.isSeekable)
      return client.sendTime(
        message.channel,
        "❌ | **¡No puedo buscar esta canción!**"
      );
    let SeekTo = client.ParseHumanTime(args.join(" "));
    if (!SeekTo)
      return client.sendTime(
        message.channel,
        `**Uso - **\`${GuildDB.prefix}buscar <número s/m/h>\` \n**Ejemplo - **\`${GuildDB.prefix}buscar 2m 10s\``
      );
    player.seek(SeekTo * 1000);
    message.react("✅");
  },
  /*
    SlashCommand: {
        options: [
            {
                name: "position",
                description: "Ingrese una marca de tiempo que desee buscar. Ejemplo - 2m 10s",
                value: "position",
                type: 3,
                required: true,
                //**
                *
                * @param {import("../structures/DiscordMusicBot")} client
                * @param {import("discord.js").Message} message
                * @param {string[]} args
                * @param {*} param3
                *
                run: async (client, interaction, args, { GuildDB }) => {
                    const guild = client.guilds.cache.get(interaction.guild_id);
                    const member = guild.members.cache.get(interaction.member.user.id);
                    let player = await client.Manager.get(interaction.guild_id);
                    
                    if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Debe estar en un canal de voz para usar este comando.**");
                    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **¡Debes estar en el mismo canal de voz que yo para usar este comando!**");
                    if (!player) return client.sendTime(interaction, "❌ | **Nada está sonando en este momento ...**");
                    if (!player.queue.current.isSeekable) return client.sendTime(interaction, "❌ | **No puedo buscar esta cancion!**");
                    let SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
                    if (!SeekTo) return client.sendTime(interaction, `**Uso - **\`${GuildDB.prefix}buscar <numero s/m/h>\` \n**Ejemplo -** \`${GuildDB.prefix}buscar 2m 10s\``);
                    player.seek(SeekTo * 1000);
                    client.sendTime(interaction, "✅ | **Movió con éxito la canción a **", `\`${Seekto}\``);
                },
            },
        ],
    },
*/
};
