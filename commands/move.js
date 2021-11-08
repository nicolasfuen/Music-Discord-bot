const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "move",
  description: "Mueve una pista a una posición específica.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["m"],
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
    if (!args[0] || !args[1])
      return client.sendTime(message.channel, "❌ | **Argumentos no válidos.**");

    // Check if (args[0] - 1) is a valid index
    let trackNum = parseInt(args[0] - 1);
    if (trackNum < 1 || trackNum > player.queue.length - 1) {
      return client.sendTime(message.channel, "❌ | **Número de pista no válido.**");
    }

    let dest = parseInt(args[1] - 1);
    if (dest < 1 || dest > player.queue.length - 1) {
      return client.sendTime(
        message.channel,
        "❌ | **Destino de pista no válido.**"
      );
    }

    // Remove from and shift array
    const track = player.queue[trackNum];
    player.queue.splice(trackNum, 1);
    player.queue.splice(dest, 0, track);
    client.sendTime(
      message.channel,
      "✅ | **" +
        track.title +
        "** ha sido movido a la posición " +
        (dest + 1) +
        "."
    );
  },

  SlashCommand: {
    options: [
      {
        name: "pista",
        value: "pista",
        type: 4,
        required: true,
        description: "Pista para moverte.",
      },
      {
        name: "posición",
        value: "track2",
        type: 4,
        required: true,
        description: "Mueve la pista seleccionada a la posición especificada.",
      },
    ],
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

      let player = await client.Manager.get(interaction.guild.id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Nada está sonando en este momento ...**"
        );
      if (!args[0].value || !args[1].value)
        return client.sendTime(interaction, "❌ | **Número de pista no válido.**");

      // Check if (args[0] - 1) is a valid index
      let trackNum = parseInt(args[0].value - 1);
      if (trackNum < 1 || trackNum > player.queue.length - 1) {
        return client.sendTime(interaction, "❌ | **Número de pista no válido.**");
      }

      let dest = parseInt(args[1].value - 1);
      if (dest < 1 || dest > player.queue.length - 1) {
        return client.sendTime(
          interaction,
          "❌ | **Destino de pista no válido.**"
        );
      }

      // Remove from and shift array
      const track = player.queue[trackNum];
      player.queue.splice(trackNum, 1);
      player.queue.splice(dest, 0, track);
      client.sendTime(
        interaction,
        "✅ | **" +
          track.title +
          "** ha sido movido a la posición " +
          (dest + 1) +
          "."
      );
    },
  },
};
