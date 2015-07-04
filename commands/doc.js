import Message from 'telegram-api/types/Message';
import request from 'request';

export default function doc(bot) {
  const ask = new Message().text('What subject are you searching for?');

  bot.command('doc', function onDoc(message) {
    // arguments are in format %subject% +count
    let [, subject, count] = message.text.replace('/doc', '')
                                       .match(/([^+]*)\+?(\d+)?/);
    subject = subject.trim();
    count = parseInt(count, 10) || 1;

    if (!subject) return bot.send(ask.to(message.chat.id)).then(onDoc);

    search(subject, count).then(results => {
      for (let result of results) {
        const msg = new Message().to(message.chat.id)
                                 .text(result.title + '\n' + result.url);
        bot.send(msg);
      }
    });
  });
}

const BASE = 'https://developer.mozilla.org/en-US/search.json?q=';
function search(subject, count = 1) {
  return new Promise((resolve, reject) => {
    request(BASE + encodeURIComponent(subject), (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      const json = JSON.parse(body);

      const answer = json.documents.slice(0, count)
                                   .map(d => ({title: d.title, url: d.url}));

      resolve(answer);
    });
  });
}
