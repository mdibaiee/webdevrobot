import FeedParser from 'feedparser';
import request from 'request';
import unirest from 'unirest';
import {read, write} from '../utils/files';

const FEEDS = read('feeds');
let {time} = read('time');
time = new Date(time);

export default function refresh() {
  const promises = FEEDS.map(feed => {
    return new Promise((resolve, reject) => {
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

          resolve({feed, posts});
          return;
        }
        posts.push(post);
      });

      parser.on('error', reject);
    });
  });

  const all = Promise.all(promises);
  all.then(() => {
    console.log('all');
    time = new Date();
    write('time', {time: time + ''});
  });

  return all;
}
