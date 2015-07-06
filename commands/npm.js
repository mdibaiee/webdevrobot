import bot from '../bot';
import Message from 'telegram-api/types/Message';
import unirest from 'unirest';

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
    unirest.get(BASE + pkg).end(({body}) => {
      if (!body) return reject();

      resolve({
        name: body.name,
        url: `https://npmjs.com/${body.name}`
      });
    });
  });
}

export default {
  syntax: '/npm <pkg>',
  help: 'Search npm for the given package'
};
