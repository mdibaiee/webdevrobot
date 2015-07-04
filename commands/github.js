import Message from 'telegram-api/types/Message';
import request from 'request';

export default function github(bot) {

  const BASE = 'https://api.github.com';
  const METHOD = '/search/repositories?q=';

  const ask = new Message().text('What repository are you searching for?');
  bot.command('github', message => {

    const search = (rep, id) => {
      new Promise((resolve, reject) => {
        request(BASE + METHOD + rep, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0'
          }
        }, (err, res, body) => {
          let result = JSON.parse(body);
          result.items.length ? resolve([rep, result.items[0].html_url]) : reject();
        });
      }).then((result) => {
        bot.send(new Message().text(result[0] + '\n' + result[1]).to(id))
      }).catch(() => {
        bot.send(new Message().text('No results found :(').to(id));
      });
    }

    let rep = message.text.slice(7).trim();

    if (!rep) {
      bot.send(ask.to(message.chat.id)).then(answer => {
        search(answer.text, message.chat.id);
      });
    } else {
      search(rep, message.chat.id);
    }
  });
}
