import Message from 'telegram-api/types/Message';
import request from 'request';
import search from '../utils/search';

import {read, write} from '../utils/files';

export default function doc(bot) {
  let CACHE;
  let TITLES;

  const BASE = 'https://developer.mozilla.org';
  const PREFIX = '/en-US/docs/Web/';
  const SOURCES = ['HTML', 'CSS', 'JavaScript', 'API'];
  const METHOD = '$children';

  const refresh = () => {
    CACHE = read('mdn');
    TITLES = CACHE.map(page => page.title);

    const promises = SOURCES.map(source => {
      return new Promise((resolve, reject) => {
        request(BASE + PREFIX + source + METHOD, (err, res, body) => {
          if (err) {
            reject(err);
            return;
          }

          const json = JSON.parse(body);

          const array = [];
          json.subpages.forEach(function flatten(page) {
            if (page.subpages) {
              page.subpages.forEach(flatten);
            }

            delete page.subpages;
            array.push(page);
          });

          resolve(array);
        });
      });
    });

    return Promise.all(promises).then(arrays => {
      const array = arrays.reduce((a, b) => {
        return a.concat(b);
      }, []);

      write('mdn', array);

      CACHE = array;
      TITLES = CACHE.map(page => page.title);

      return array;
    });
  };
  refresh().then(() => {
    setInterval(refresh, 1000 * 60 * 60);
  });

  const getSubject = subject => {
    const [index, string, relevance] = search(TITLES, subject)[0];
    const page = CACHE[index];

    if (relevance <= 1) return new Message().text('No results found :(');

    return new Message().text(string + '\n' + BASE + page.url);
  };

  const ask = new Message().text('What subject are you searching for?');
  bot.command('doc', function docCommand(message) {
    let subject = message.text.slice(4).trim();

    if (!subject) {
      bot.send(ask.to(message.chat.id)).then(docCommand);
    } else {
      bot.send(getSubject(subject).to(message.chat.id));
    }
  });
}
