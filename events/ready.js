module.exports = async (client) => {
  (client.Ready = true),
    client.user.setPresence({
      status: "online", // You can show online, idle, and dnd
      activity: {
        name: `m1!ayuda | Estoy en ${client.guilds.cache.size} servidores!!`,   // The message shown
        type: "WATCHING", // PLAYING, WATCHING, LISTENING, STREAMING,
      },
    });
  client.Manager.init(client.user.id);
  client.log("Iniciar sesión correctamente como " + client.user.tag); // You can change the text if you want, but DO NOT REMOVE "client.user.tag"
  client.RegisterSlashCommands();
};
