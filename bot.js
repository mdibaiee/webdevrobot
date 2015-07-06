import Bot from 'telegram-api/build';

let bot = new Bot({
  token: process.env.JAVASCRIPTBOT_TOKEN
});

export default bot;

bot.start();
