import Message from 'telegram-api/types/Message';
import request from 'request';

export default function npm(bot) {

  const BASE = 'http://registry.npmjs.org/';

  const ask = new Message().text('What package are you searching for?');
  bot.command('npm', message => {

    const search = (pkg, id) => {
      new Promise((resolve, reject) => {
        request(BASE + pack, (err, res, body) => {
          try {
            const result = JSON.parse(body);
            resolve(result.name);
          } catch(e) {
            reject();
          }
        });
      }).then(result => {
        const msg = new Message()
                    .text(`${pkg}\nhttps://www.npmjs.com/${result}`)
                    .to(id);
        bot.send(msg);
      }).catch(() => {
        bot.send(new Message().text('No results found :(').to(id));
      });
    };

    let pack = message.text.slice(4).trim();

    if (!pack) {
      bot.send(ask.to(message.chat.id)).then(answer => {
        search(answer.text, message.chat.id);
      });
    } else {
      search(pack, message.chat.id);
    }
  });
}
