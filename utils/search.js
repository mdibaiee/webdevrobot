export default function(array, string) {
  const words = string.split(/\W/);

  return array.map((str, index) => {
    const same = str.toLowerCase() === string.toLowerCase() ? Infinity : 0;

    const fr = str.has(string) ? 5 : 0;

    const relevance = words.reduce((a, b) => {
      return a + (str.has(b) ? 1 : 0);
    }, 0);

    return [index, str, same + relevance + fr];
  }).sort((a, b) => a[2] > b[2] ? -1 : 1);
}

String.prototype.has = function(string) {
  const regex = new RegExp(string, 'i');

  return regex.test(this);
};
