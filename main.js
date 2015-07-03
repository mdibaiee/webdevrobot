import Bot from 'telegram-api/build';

import BulkMessage from 'telegram-api/types/BulkMessage';
import Message from 'telegram-api/types/Message';

import FeedParser from 'feedparser';
import request from 'request';

import {read, write} from './files';

import users from './users.json';
import feeds from './feeds.json';

let bot = new Bot({
  token: '121143906:AAFJz_-Bjwq_8KQqTmyY2MtlcPb-bX_1O7M'
});

bot.start();

const refresh = (cb) => {
  for (let feed of feeds) {
    const req = request(feed.url);
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10)');
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    const parser = new FeedParser();

    req.on('response', res => res.pipe(parser));

    let posts = [];

    let first;
    parser.on('data', function listener(post) {
      first = first || post;

      if (post.title === feed.latest) {
        parser.removeListener('data', listener);

        feed.latest = first.title;
        write('feeds', feeds);

        if (cb) cb(posts);

        return;
      }
      posts.push(post);
    });
  }
};

const cb = function(posts) {
  for (let post of posts) {
    const msg = new BulkMessage().text(post.title + '\n' + post.link)
                                 .to(users);
    bot.send(msg);
  }
};

refresh(cb);
setInterval(refresh.bind(null, cb), 1000 * 60 * 5);

const success = new Message().text('You\'ve been successfuly subscribed!');
bot.command('subscribe', message => {
  users.push(message.chat.id);
  write('users', users);

  bot.send(success.to(message.chat.id));
});
