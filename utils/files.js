import fs from 'fs';

export function write(file, json) {
  return fs.writeFileSync(`stores/${file}.json`,
                          JSON.stringify(json, null, 2));
}

export function read(file) {
  return JSON.parse(fs.readFileSync(`stores/${file}.json`));
}
