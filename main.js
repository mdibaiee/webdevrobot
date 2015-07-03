import Bot from 'telegram-api/build';
import Message from 'telegram-api/types/Message';
import subscribe from './commands/subscribe';
import doc from './commands/doc';

let bot = new Bot({
  token: '121143906:AAFJz_-Bjwq_8KQqTmyY2MtlcPb-bX_1O7M'
});

bot.start();

const welcome = new Message().text(`Hello!
  You can subscribe to /r/javascript using /subscribe command!`);
bot.command('start', message => {
  console.log(message.chat.id);
  bot.send(welcome.to(message.chat.id));
});


subscribe(bot);
doc(bot);
