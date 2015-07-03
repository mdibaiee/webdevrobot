import fs from 'fs';

export function write(file, json) {
  return fs.writeFileSync(`./${file}.json`, JSON.stringify(json, null, 2));
}

export function read(file) {
  return JSON.parse(fs.readFileSync(`./${file}.json`));
}
