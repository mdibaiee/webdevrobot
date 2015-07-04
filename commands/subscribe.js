import BulkMessage from 'telegram-api/types/BulkMessage';
import Message from 'telegram-api/types/Message';

import FeedParser from 'feedparser';
import request from 'request';

import {read, write} from '../utils/files';

export default function subscribe(bot) {
  const users = read('users');
  const feeds = read('feeds');
  let {time} = read('time');

  time = new Date(time);

  const refresh = () => {
    return new Promise((resolve, reject) => {
      for (let feed of feeds) {
        const req = request(feed.url);
        req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10)');
        req.setHeader('accept', 'text/html,application/xhtml+xml');

        const parser = new FeedParser();

        req.on('response', res => res.pipe(parser));
        req.on('error', reject);

        let posts = [];

        parser.on('data', function listener(post) {
          const date = new Date(post.date);

          if (date < time) {
            parser.removeListener('data', listener);

            write('time', {time: new Date()});

            console.log(posts);
            resolve(posts);
            return;
          }
          posts.push(post);
        });

        parser.on('error', reject);
      }
    });
  };

  const cb = function(posts) {
    for (let post of posts) {
      const msg = new BulkMessage().text(post.title + '\n' + post.link)
                                   .to(users);
      bot.send(msg);
    }
  };

  refresh().then(cb);
  setInterval(refresh.bind(null, cb), 1000 * 60 * 5);

  const success = new Message().text('You\'ve been successfuly subscribed!');
  const duplicate = new Message().text('You are already subscribed!');
  bot.command('subscribe', message => {
    if (users.indexOf(message.chat.id) > -1) {
      bot.send(duplicate.to(message.chat.id));
      return;
    }

    users.push(message.chat.id);
    write('users', users);

    bot.send(success.to(message.chat.id));
  });

  const no = new Message().text('You are not subscribed at all!');
  const unsubscribed = new Message().text('You\'ve been unsubscribed.');
  bot.command('unsubscribe', message => {
    const index = users.indexOf(message.chat.id);
    if (index === -1) {
      bot.send(no.to(message.chat.id));
    } else {
      users.splice(index, 1);
      write('users', users);
      bot.send(unsubscribed.to(message.chat.id));
    }
  });
}
