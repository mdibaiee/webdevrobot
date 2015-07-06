import bot from '../bot';
import Message from 'telegram-api/types/Message';
import unirest from 'unirest';

bot.command('github <query> [+count]', message => {
  search(message.args.query, message.args.count).then(items => {
    for (let {name, url} of items) {
      const msg = new Message().text(`${name}\n${url}`).to(message.chat.id);
      bot.send(msg);
    }
  }, () => {
    bot.send(new Message().text('No results found :(').to(message.chat.id));
  });
});

const BASE = 'https://api.github.com/search/repositories?q=';
const UA = 'Mozilla/5.0 (X11; Linux x86_64; rv:40.0) Gecko/2010 Firefox/40.0';

function search(query, count = 1) {
  return new Promise((resolve, reject) => {
    unirest.get(BASE + query)
    .set('User-Agent', UA)
    .end(response => {
      const body = response.body;

      if (body.items && body.items.length) {
        const items = body.items.slice(0, count).map(item => {
          return {name: item.name, url: item.html_url};
        });
        resolve(items);
      } else {
        reject();
      }
    });
  });
}

export default {
  syntax: '/github <repository> [+count]',
  help: 'Search github for the given repository'
};
