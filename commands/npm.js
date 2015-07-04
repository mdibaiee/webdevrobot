import Message from 'telegram-api/types/Message';
import request from 'request';
import cheerio from 'cheerio';

export default function npm(bot) {

  const BASE = 'https://www.npmjs.com';
  const METHOD = '/search?q=';

  const ask = new Message().text('What package are you searching for?');
  bot.command('npm', message => {

    const search = (pack, id) => {
      new Promise((resolve, reject) => {
        request(BASE + METHOD + pack, (err, res, body) => {
          const $ = cheerio.load(body);
          const result = $('.search-results > li:nth-child(1) > div:nth-child(1) > h3:nth-child(1) > a:nth-child(1)').attr('href');
          result ? resolve([pack, result]) : reject();
        });
      }).then((result) => {
        bot.send(new Message().text(result[0] + '\n' + BASE + result[1]).to(id))
      }).catch(() => {
        bot.send(new Message().text('No results found :(').to(id));
      });
    }

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
