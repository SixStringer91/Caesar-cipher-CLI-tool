const fs = require('fs');
const { Transform } = require('stream');

module.exports =  async function ({ input, output, handler}) {
  const inputStream = typeof input === 'string'
    ? fs.createReadStream(input, 'utf8')
    : input;
  const outputStream = typeof output === 'string'
    ? fs.createWriteStream(output, { flags: 'a+', encoding: 'utf8' })
    : output;
  const tsStream = new Transform({
    transform(chunk, enc, callback) {
      const transformed = enc !== 'utf-8'
        ? handler(chunk.toString('utf8'))
        : handler(chunk);
      this.push(transformed);
      callback();
    },
    final() {
      this.push('\n')
    }
  });
  await inputStream.pipe(tsStream).pipe(outputStream);
}

