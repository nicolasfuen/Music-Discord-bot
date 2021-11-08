const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "youtube",
  description: "Inicie una sesión de YouTube Together.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["yt"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {require("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **¡Debes estar en un canal de voz para reproducir algo!**"
      );
    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.me)
        .has("CREATE_INSTANT_INVITE")
    )
      return client.sendTime(
        message.channel,
        "❌ | **El bot no tiene permiso para crear invitaciones**"
      );

    let Invite = await message.member.voice.channel.activityInvite(
      "755600276941176913"
    ); //Made using discordjs-activity package
    let embed = new MessageEmbed()
      .setAuthor(
        "YouTube juntos",
        "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
      )
      .setColor("#FF0000").setDescription(`
Con **YouTube Together** puedes mirar YouTube con tus amigos en un canal de voz. ¡Haz clic en * Únete a YouTube juntos * para unirte!
__**[Únete a YouTube juntos](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** Esto solo funciona en el escritorio
`);
    message.channel.send(embed);
  },
  SlashCommand: {
    options: [],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | Debe estar en un canal de voz para usar este comando."
        );
      if (
        !member.voice.channel
          .permissionsFor(guild.me)
          .has("CREATE_INSTANT_INVITE")
      )
        return client.sendTime(
          interaction,
          "❌ | **El bot no tiene permiso para crear invitaciones**"
        );

      let Invite = await member.voice.channel.activityInvite(
        "755600276941176913"
      ); //Made using discordjs-activity package
      let embed = new MessageEmbed()
        .setAuthor(
          "YouTube juntos",
          "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
        )
        .setColor("#FF0000").setDescription(`
Utilizando **YouTube juntos** Puedes ver YouTube con tus amigos en un canal de voz. Hacer clic *Únete a YouTube juntos* para unirse!

__**[Join YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** Esto solo funciona en el escritorio
`);
      interaction.send(embed.toJSON());
    },
  },
};
