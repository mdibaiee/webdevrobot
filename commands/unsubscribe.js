import bot from '../bot';
import Message from 'telegram-api/types/Message';
import Question from 'telegram-api/types/Question';
import Keyboard from 'telegram-api/types/Keyboard';
import {read, write} from '../utils/files';

const USERS = read('users');

// Messages
const hideKeyboard = new Keyboard().hide();
const no = new Message().text('You are not subscribed at all!')
                        .keyboard(hideKeyboard);
const unsubscribed = new Message().text('You\'ve been unsubscribed.')
                                  .keyboard(hideKeyboard);
const noFeed = new Question()
                            .text('What feed do you want to unsubscribe from?');

// Command
bot.command('unsubscribe <feed>', message => {
  const feed = message.args.feed;

  if (feed) {
    unsubscribe(message.chat.id, feed);
  } else {
    const keys = [];
    for (let list of Object.keys(users)) {
      if (users[list].indexOf(message.chat.id) > -1) {
        subscribed.push([feed]);
      }
    }
    bot.send(noFeed.answers(keys).to(message.chat.id).reply(message.message_id))
    .then(answer => {
      unsubscribe(message.chat.id, answer.text);
    });
  }
});

function unsubscribe(id, feed) {
  const users = USERS[feed];

  const index = users.indexOf(id);
  if (index === -1) {
    bot.send(no.to(id));
  } else {
    users.splice(index, 1);

    write('users', USERS);

    bot.send(unsubscribed.to(id));
  }
}


export default {
  syntax: '/unsubscribe <feed>',
  help: 'Unsubscribe from feeds'
};
