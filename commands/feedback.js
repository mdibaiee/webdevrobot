import bot from '../bot';
import Message from 'telegram-api/types/Message';

const DEV_ID = 33352579;
const THANKS = 'Thanks for helping us improve our bot!';

bot.command('feedback ...text', message => {
  const username = message.from.username;
  const text = message.args.text;
  const msg = new Message().to(DEV_ID)
                           .text(`Feedback from @${username}\n${text}`);
  bot.send(msg);

  bot.send(new Message().text(THANKS).to(message.chat.id));
});

export default {
  syntax: '/feedback ...message',
  help: 'Send feedback to developer'
};
