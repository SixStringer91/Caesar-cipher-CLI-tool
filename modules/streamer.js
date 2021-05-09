const fs = require('fs');
const { Transform } = require('stream');

module.exports = function ({input,output,handler,dir}){
const inputStream = typeof input  === 'string' ?  fs.createReadStream(`${dir}/${input}`, 'utf8') : input;
const outputStream = typeof output  === 'string' ? fs.createWriteStream(`${dir}/${output}`,{flags: 'a+', encoding:'utf8'}) : output;
const tsStream = new Transform({
  transform(chunk, enc, callback) {
    const transformed = enc !== 'utf-8'
      ? handler(chunk.toString('utf8'))
      : handler(chunk);
    this.push(transformed);
    callback();
  },
  final(){
    this.push('\n')
  }
});
inputStream.pipe(tsStream).pipe(outputStream);
}

