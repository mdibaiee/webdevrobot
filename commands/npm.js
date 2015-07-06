import bot from '../bot';
import Message from 'telegram-api/types/Message';
import request from 'request';

const BASE = 'http://registry.npmjs.org/';

bot.command('npm <pkg>', message => {
  let pkg = message.args.pkg;

  search(pkg).then(item => {
    const msg = new Message().text(`${item.name}\n${item.url}`)
                             .to(message.chat.id);
    bot.send(msg);
  }, () => {
    const msg = new Message().text('No results found :(').to(message.chat.id);

    bot.send(msg);
  });
});

function search(pkg) {
  return new Promise((resolve, reject) => {
    request(BASE + pkg, (err, res, body) => {
      try {
        const result = JSON.parse(body);
        resolve({
          name: pkg,
          url: `https://npmjs.com/${result.name}`
        });
      } catch(e) {
        reject();
      }
    });
  });
}

export default {
  syntax: '/npm <pkg>',
  help: 'Search npm for the given package'
};
