import bot from '../bot';
import Message from 'telegram-api/types/Message';
import Question from 'telegram-api/types/Question';
import Keyboard from 'telegram-api/types/Keyboard';
import {read, write} from '../utils/files';

let USERS = read('users');

// Messages
const hideKeyboard = new Keyboard().hide();

// Command
bot.command('unsubscribe ...feed', message => {
  const feed = message.args.feed;

  if (feed) {
    unsubscribe(message.chat.id, feed);
  } else {
    const keys = [];
    for (let list of Object.keys(USERS)) {
      if (USERS[list].indexOf(message.chat.id) > -1) {
        keys.push([list]);
      }
    }
    const msg = new Question().text('Select a feed to unsubscribe from')
                              .answers(keys).to(message.chat.id)
                              .reply(message.message_id);
    bot.send(msg).then(answer => {
      unsubscribe(message.chat.id, answer.text);
    });
  }
});

function unsubscribe(id, feed) {
  USERS = read('users');

  const users = USERS[feed];

  const index = users.indexOf(id);
  if (index === -1) {
    const msg = new Message().text(`You are not subscribed to ${feed}`).to(id)
                             .keyboard(hideKeyboard);
    bot.send(msg);
  } else {
    users.splice(index, 1);

    write('users', USERS);

    const msg = new Message().text(`Unsubscribed from ${feed}`).to(id)
                             .keyboard(hideKeyboard);
    bot.send(msg);
  }
}


export default {
  syntax: '/unsubscribe [feed]',
  help: 'Unsubscribe from feeds'
};
