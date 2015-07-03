import Bot from 'telegram-api/build';
import Message from 'telegram-api/types/Message';
import subscribe from './commands/subscribe';
import doc from './commands/doc';

let bot = new Bot({
  token: '121143906:AAFJz_-Bjwq_8KQqTmyY2MtlcPb-bX_1O7M'
});

bot.start();

const welcome = new Message().text(`Hello!
I give you services to search across various sources such as MDN, GitHub, etc.

Commands:
/subscribe - Subscribe to /r/javascript and get a message for each new message
/unsubscribe - Unsubscribe
/doc [subject] - Search MDN for the given subject`);
bot.command('start', message => {
  bot.send(welcome.to(message.chat.id));
});


subscribe(bot);
doc(bot);
