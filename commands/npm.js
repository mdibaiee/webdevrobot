import bot from '../bot';
import Message from 'telegram-api/types/Message';
import search from 'enpeem-search';

bot.command('npm <pkg> [+count]', message => {
  search(message.args.pkg, message.args.count).then(items => {
    for (let {name, url} of items) {
      const msg = new Message().text(`${name}\n${url}`).to(message.chat.id);
      bot.send(msg);
    }
  }, () => {
    const msg = new Message().text('No results found :(').to(message.chat.id);

    bot.send(msg);
  });
});

export default {
  syntax: '/npm <pkg> [+count]',
  help: 'Search npm for the given package'
};
