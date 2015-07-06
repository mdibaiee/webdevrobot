import bot from '../bot';
import Message from 'telegram-api/types/Message';
import commands from './all';

let text = '';
for (let key of Object.keys(commands)) {
  const command = commands[key];

  text += `${command.syntax} – ${command.help}\n\n`;
}

const help = new Message().text(text);
bot.command('help', message => {
  bot.send(help.to(message.chat.id));
});
