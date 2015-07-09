import bot from '../bot';
import fetch from '../utils/fetch-feeds';
import {read, write} from '../utils/files';
import BulkMessage from 'telegram-api/types/BulkMessage';
import Message from 'telegram-api/types/Message';
import Question from 'telegram-api/types/Question';
import Keyboard from 'telegram-api/types/Keyboard';

let USERS = read('users');
let FEEDS = read('feeds');

for (let feed of FEEDS) {
  if (!USERS[feed.id]) USERS[feed.id] = [];
}

const INTERVAL = 1000 * 60 * 2;

// Messages
const hideKeyboard = new Keyboard().hide();
const keys = FEEDS.map(feed => {
  return [feed.id];
});
const noFeed = new Question().text('What feed do you want to subscribe to?')
                             .answers(keys);

// Command
bot.command('subscribe ...feed', message => {
  const feed = message.args.feed;

  if (!feed) {
    bot.send(noFeed.to(message.chat.id).reply(message.message_id))
    .then(answer => {
      subscribe(message.chat.id, answer.text);
    });
  } else {
    subscribe(message.chat.id, feed);
  }
});

function subscribe(id, feed) {
  USERS = read('users');

  const users = USERS[feed];

  if (!users) return;

  if (users.indexOf(id) > -1) {
    const msg = new Message().text(`Already subscribed to ${feed}`).to(id)
                             .keyboard(hideKeyboard);
    bot.send(msg);

    return;
  }

  users.push(id);
  write('users', USERS);

  const msg = new Message().text(`Subscribed to ${feed}`).to(id)
                           .keyboard(hideKeyboard);
  bot.send(msg);
}

const cb = function(answers) {
  for (let {feed, posts} of answers) {
    const users = USERS[feed.id];
    for (let post of posts) {
      const msg = new BulkMessage().text(post.title + '\n' + post.link)
                                   .to(users);
      bot.send(msg);
    }
  }
};

fetch().then(cb);
setInterval(() => {
  fetch().then(cb);
}, INTERVAL);

export default {
  syntax: '/subscribe [feed]',
  help: 'Subscribe to RSS feeds! See the list of /feeds'
};
