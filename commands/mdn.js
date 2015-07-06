import bot from '../bot';
import Message from 'telegram-api/types/Message';
import request from 'request';

bot.command('mdn <subject> [+count]', message => {
  const {subject, count} = message.args;

  if (!subject) return;

  search(subject, count).then(items => {
    for (let {title, url} of items) {
      const msg = new Message().to(message.chat.id)
                               .text(`${title}\n${url}`);
      bot.send(msg);
    }
  }, () => {
    const msg = new Message().text('No results found :(').to(message.chat.id);
    bot.send(msg);
  });
});

const BASE = 'https://developer.mozilla.org/en-US/search.json?q=';
function search(subject, count = 1) {
  return new Promise((resolve, reject) => {
    request(BASE + encodeURIComponent(subject), (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      const json = JSON.parse(body);

      if (!json.documents.length) {
        reject();
      }

      const items = json.documents.slice(0, count)
                                   .map(d => ({title: d.title, url: d.url}));

      resolve(items);
    });
  });
}

export default {
  syntax: '/mdn <subject> [+count]',
  help: 'Search MDN for the given subject'
};
