import bot from '../bot';
import Message from 'telegram-api/types/Message';
import {read} from '../utils/files';

const feeds = read('feeds');
bot.command('feeds', message => {
  let text = '';
  for (let feed of feeds) {
    text += `${feed.id} => ${feed.url}\n\n`;
  }

  const msg = new Message().text(text).to(message.chat.id);
  bot.send(msg);
});

export default {
  syntax: '/feeds',
  help: 'Show list of supported feeds'
};
