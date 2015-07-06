import bot from '../bot';
import Message from 'telegram-api/types/Message';

const start = new Message().text(`Hello!
I give you services to search across various sources such as MDN, GitHub, etc.

Try /help`);
bot.command('start', message => {
  bot.send(start.to(message.chat.id));
});
