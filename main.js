import Bot from 'telegram-api/build';
import Message from 'telegram-api/types/Message';
import subscribe from './commands/subscribe';
import doc from './commands/doc';
import npm from './commands/npm';
import github from './commands/github';

let bot = new Bot({
  token: process.env.JAVASCRIPTBOT_TOKEN
});

bot.start();

const COMMANDS = `Commands:
/subscribe - Subscribe to /r/javascript and get a message for each new message
/unsubscribe - Unsubscribe
/doc [subject] - Search MDN for the given subject
/github [repository] - Search GitHub for a repository
/npm [package] - Search NPM for a package`;

const start = new Message().text(`Hello!
I give you services to search across various sources such as MDN, GitHub, etc.

${COMMANDS}`);

bot.command('start', message => {
  bot.send(start.to(message.chat.id));
});

const help = new Message().text(COMMANDS);
bot.command('help', message => {
  bot.send(help.to(message.chat.id));
});


subscribe(bot);
doc(bot);
npm(bot);
github(bot);
