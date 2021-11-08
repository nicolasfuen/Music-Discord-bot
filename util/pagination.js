module.exports = async (
  msg,
  pages,
  client,
  emojiList = ["◀️", "⏹️", "▶️"],
  timeout = 120000
) => {
  if (!msg && !msg.channel) throw new Error("El canal es inaccesible.");
  if (!pages) throw new Error("No se dan páginas.");

  let page = 0;
  const curPage = await msg.channel.send(
    pages[page].setFooter(
      `Página ${page + 1}/${pages.length} `,
      msg.author.displayAvatarURL({ dynamic: true })
    )
  );
  for (const emoji of emojiList) await curPage.react(emoji);
  const reactionCollector = curPage.createReactionCollector(
    (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
    { time: timeout }
  );
  reactionCollector.on("recoger", (reaction) => {
    reaction.users.remove(msg.author);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[1]:
        curPage.reactions.removeAll();
        break;
      case emojiList[2]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
    }
    curPage.edit(
      pages[page].setFooter(
        `Página ${page + 1}/${pages.length} `,
        msg.author.displayAvatarURL({ dynamic: true })
      )
    );
  });
  reactionCollector.on("fin", () => {
    if (!curPage.deleted) {
      curPage.reactions.removeAll();
    }
  });
  return curPage;
};
