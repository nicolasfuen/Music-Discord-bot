const { Util, MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "play",
  description: "Toca tus canciones favoritas.",
  usage: "[song]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["p"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "  <a:noanimado:897608222624600094> | **¡Debes estar en un canal de voz para reproducir algo!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        " <a:noanimado:897608222624600094> | **¡Debes estar en el mismo canal de voz que yo para usar este comando!**"
      );
    let SearchString = args.join(" ");
    if (!SearchString)
      return client.sendTime(
        message.channel,
        `**Uso - **\`${GuildDB.prefix}play [song]\``
      );
    let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
    let Searching = await message.channel.send("<a:cargando:897606663962517565> Buscando...");
    if (!CheckNode || !CheckNode.connected) {
      return client.sendTime(
        message.channel,
        "❌ | **Node de Lavalink no conectado**"
      );
    }
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: client.botconfig.ServerDeafen,
      volume: client.botconfig.DefaultVolume,
    });

    let SongAddedEmbed = new MessageEmbed().setColor(
      client.botconfig.EmbedColor
    );

    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nada está sonando en este momento ...**"
      );

    if (player.state != "CONNECTED") await player.connect();

    try {
      if (SearchString.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(SearchString);

        if (Searched.loadType === "PLAYLIST_LOADED") {
          let songs = [];
          for (let i = 0; i < Searched.tracks.length; i++)
            songs.push(TrackUtils.build(Searched.tracks[i], message.author));
          player.queue.add(songs);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();
          SongAddedEmbed.setAuthor(
            `Lista de reproducción agregada a la cola`,
            message.author.displayAvatarURL()
          );
          SongAddedEmbed.addField(
            "En cola",
            `\`${Searched.tracks.length}\` canciones`,
            false
          );
          //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
          Searching.edit(SongAddedEmbed);
        } else if (Searched.loadType.startsWith("TRACK")) {
          player.queue.add(
            TrackUtils.build(Searched.tracks[0], message.author)
          );
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(`Agregado a la cola`, client.botconfig.IconURL);
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          );
          SongAddedEmbed.addField(
            "Autor",
            Searched.tracks[0].info.author,
            true
          );
          //SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              "Posición en fila",
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit(SongAddedEmbed);
        } else {
          return client.sendTime(
            message.channel,
            "**No se encontraron coincidencias para - **" + SearchString
          );
        }
      } else {
        let Searched = await player.search(SearchString, message.author);
        if (!player)
          return client.sendTime(
            message.channel,
            "❌ | **Nada está sonando en este momento ...**"
          );

        if (Searched.loadType === "NO_MATCHES")
          return client.sendTime(
            message.channel,
            "**No se encontraron coincidencias para - **" + SearchString
          );
        else if (Searched.loadType == "PLAYLIST_LOADED") {
          player.queue.add(Searched.tracks);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();
          SongAddedEmbed.setAuthor(
            `Lista de reproducción agregada a la cola`,
            client.botconfig.IconURL
          );
          SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.playlist.name}](${SearchString})`
          );
          SongAddedEmbed.addField(
            "En cola",
            `\`${Searched.tracks.length}\` canciones`,
            false
          );
          SongAddedEmbed.addField(
            "Duración de la lista de reproducción",
            `\`${prettyMilliseconds(Searched.playlist.duration, {
              colonNotation: true,
            })}\``,
            false
          );
          Searching.edit(SongAddedEmbed);
        } else {
          player.queue.add(Searched.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(`Agregado a la cola`, client.botconfig.IconURL);

          SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
          );
          SongAddedEmbed.addField("Autor", Searched.tracks[0].author, true);
          SongAddedEmbed.addField(
            "Duración",
            `\`${prettyMilliseconds(Searched.tracks[0].duration, {
              colonNotation: true,
            })}\``,
            true
          );
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              "Posición en fila",
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit(SongAddedEmbed);
        }
      }
    } catch (e) {
      console.log(e);
      return client.sendTime(
        message.channel,
        "**No se encontraron coincidencias para - **" + SearchString
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "canción",
        value: "canción",
        type: 3,
        required: true,
        description: "Reproducir música en el canal de voz",
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
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Debe estar en un canal de voz para usar este comando.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **¡Debes estar en el mismo canal de voz que yo para usar este comando!**"
        );
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(
          interaction,
          "❌ | **Node de Lavalink no conectado**"
        );
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: client.botconfig.ServerDeafen,
      });
      if (player.state != "CONNECTED") await player.connect();
      let search = interaction.data.options[0].value;
      let res;

      if (search.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(search);

        switch (Searched.loadType) {
          case "LOAD_FAILED":
            if (!player.queue.current) player.destroy();
            return client.sendError(
              interaction,
              `❌ | **Hubo un error al buscar**`
            );

          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return client.sendTime(
              interaction,
              "❌ | **No se encontraron resultados.**"
            );
          case "TRACK_LOADED":
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(
              `Agregado a la cola`,
              client.botconfig.IconURL
            );
            SongAddedEmbed.setColor(client.botconfig.EmbedColor);
            SongAddedEmbed.setDescription(
              `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
            );
            SongAddedEmbed.addField(
              "Autor",
              Searched.tracks[0].info.author,
              true
            );
            if (player.queue.totalSize > 1)
              SongAddedEmbed.addField(
                "Posición en fila",
                `${player.queue.size - 0}`,
                true
              );
            return interaction.send(SongAddedEmbed);

          case "SEARCH_RESULT":
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAdded = new MessageEmbed();
            SongAdded.setAuthor(`Agregado a la cola`, client.botconfig.IconURL);
            SongAdded.setColor(client.botconfig.EmbedColor);
            SongAdded.setDescription(
              `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
            );
            SongAdded.addField("Autor", Searched.tracks[0].info.author, true);
            if (player.queue.totalSize > 1)
              SongAdded.addField(
                "Posición en fila",
                `${player.queue.size - 0}`,
                true
              );
            return interaction.send(SongAdded);

          case "PLAYLIST_LOADED":
            let songs = [];
            for (let i = 0; i < Searched.tracks.length; i++)
              songs.push(TrackUtils.build(Searched.tracks[i], member.user));
            player.queue.add(songs);
            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === Searched.tracks.length
            )
              player.play();
            let Playlist = new MessageEmbed();
            Playlist.setAuthor(
              `Lista de reproducción agregada a la cola`,
              client.botconfig.IconURL
            );
            Playlist.setDescription(
              `[${Searched.playlistInfo.name}](${interaction.data.options[0].value})`
            );
            Playlist.addField(
              "En cola",
              `\`${Searched.tracks.length}\` canciones`,
              false
            );
            return interaction.send(Playlist);
        }
      } else {
        try {
          res = await player.search(search, member.user);
          if (res.loadType === "CARGA FALLIDA") {
            if (!player.queue.current) player.destroy();
            return client.sendError(
              interaction,
              `:x: | **Hubo un error al buscar**`
            );
          }
        } catch (err) {
          return client.sendError(
            interaction,
            `Hubo un error al buscar: ${err.message}`
          );
        }
        switch (res.loadType) {
          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return client.sendTime(
              interaction,
              "❌ | **No se encontraron resultados.**"
            );
          case "TRACK_LOADED":
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(
              `Agregado a la cola`,
              client.botconfig.IconURL
            );
            SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
            SongAddedEmbed.setColor(client.botconfig.EmbedColor);
            SongAddedEmbed.setDescription(
              `[${res.tracks[0].title}](${res.tracks[0].uri})`
            );
            SongAddedEmbed.addField("Author", res.tracks[0].author, true);
            SongAddedEmbed.addField(
              "Duration",
              `\`${prettyMilliseconds(res.tracks[0].duration, {
                colonNotation: true,
              })}\``,
              true
            );
            if (player.queue.totalSize > 1)
              SongAddedEmbed.addField(
                "Posición en fila",
                `${player.queue.size - 0}`,
                true
              );
            return interaction.send(SongAddedEmbed);

          case "PLAYLIST_LOADED":
            player.queue.add(res.tracks);
            await player.play();
            let SongAdded = new MessageEmbed();
            SongAdded.setAuthor(
              `Playlist added to queue`,
              client.botconfig.IconURL
            );
            SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
            SongAdded.setDescription(
              `[${res.playlist.name}](${interaction.data.options[0].value})`
            );
            SongAdded.addField(
              "En cola",
              `\`${res.tracks.length}\` canciones`,
              false
            );
            SongAdded.addField(
              "Duración de la lista de reproducción",
              `\`${prettyMilliseconds(res.playlist.duration, {
                colonNotation: true,
              })}\``,
              false
            );
            return interaction.send(SongAdded);
          case "SEARCH_RESULT":
            const track = res.tracks[0];
            player.queue.add(track);

            if (!player.playing && !player.paused && !player.queue.length) {
              let SongAddedEmbed = new MessageEmbed();
              SongAddedEmbed.setAuthor(
                `Agregado a la cola`,
                client.botconfig.IconURL
              );
              SongAddedEmbed.setThumbnail(track.displayThumbnail());
              SongAddedEmbed.setColor(client.botconfig.EmbedColor);
              SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
              SongAddedEmbed.addField("Autor", track.author, true);
              SongAddedEmbed.addField(
                "Duración",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Posición en fila",
                  `${player.queue.size - 0}`,
                  true
                );
              player.play();
              return interaction.send(SongAddedEmbed);
            } else {
              let SongAddedEmbed = new MessageEmbed();
              SongAddedEmbed.setAuthor(
                `Agregado a la cola`,
                client.botconfig.IconURL
              );
              SongAddedEmbed.setThumbnail(track.displayThumbnail());
              SongAddedEmbed.setColor(client.botconfig.EmbedColor);
              SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
              SongAddedEmbed.addField("Author", track.author, true);
              SongAddedEmbed.addField(
                "Duración",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Posición en fila",
                  `${player.queue.size - 0}`,
                  true
                );
              interaction.send(SongAddedEmbed);
            }
        }
      }
    },
  },
};
