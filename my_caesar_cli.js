const fs = require('fs');
const { Transform } = require('stream')
const program = require('commander');

class CipheringMachine {
  shift = null;
  action = null;
  constructor() {
    this.baseString = 'abcdefghijklmnopqrstuvwxyz'.split('');
    this.input = '';
    this.output = '';
  };
  error = () => process.stderr.write("omg");
  setAction = action => this.action = action;
  setShift = number => this.shift = number;
  setInput = input => this.input = input;
  setOutput = output => this.output = output;
  start = () => {
    if ((this.action !== 'encode' && this.action !== 'decode') || this.shift === null) {
      this.error();
      return
    }
    const cyphering = (chunk) => { return this[`_${this.action}`](chunk) }
    const inputStream = fs.createReadStream(this.input, 'utf8');
    const outputStream = fs.createWriteStream(this.output, 'utf8');
    const tsStream = new Transform({
      transform(chunk, enc, callback) {
        const transformed = enc !== 'utf-8'
          ? cyphering(chunk.toString('utf8'))
          : cyphering(chunk);
        this.push(transformed);
        callback();
      }
    });

    inputStream.pipe(tsStream).pipe(outputStream);
    // inputStream.on('data', chunk => {
    //   const transformed = this[`_${this.action}`](chunk);
    //   outputStream.write(transformed);
    // });
  }
  _isUpperCase = sym => sym.toUpperCase() === sym ? true : false;
  _indexDefiner = (currentIndex) => {
    if (this.action === 'encode') {
      return currentIndex > this.baseString.length - 1
        ? this._indexDefiner(currentIndex - this.baseString.length)
        : this.baseString[currentIndex];
    }
    if (this.action === 'decode') {
      return currentIndex < 0
        ? this._indexDefiner(currentIndex + this.baseString.length)
        : this.baseString[currentIndex];
    }
  }
  _maper = sym => {
    const finded = this.baseString.findIndex(el => el === sym.toLowerCase());
    return finded !== -1
      ? { index: finded, isUpperCase: this._isUpperCase(sym) }
      : String(sym);
  };
  _encode = a => {
    const message = a.split('').map((sym) => this._maper(sym));
    return message.map(el => {
      if (typeof el === 'object') {
        const currentIndex = el.index + this.shift;
        const currentSymb = this._indexDefiner(currentIndex);
        return el.isUpperCase
          ? currentSymb.toUpperCase()
          : currentSymb
      }
      else {
        return el;
      }
    }).join('');
  };
  _decode = a => {
    const message = a.split('').map((sym) => this._maper(sym));
    return message.map(el => {
      if (typeof el === 'object') {
        const currentIndex = el.index - this.shift;
        const currentSymb = this._indexDefiner(currentIndex)
        return el.isUpperCase ? currentSymb.toUpperCase() : currentSymb
      }
      else {
        return el;
      }
    }).join('');

  };
};

const caesar = new CipheringMachine();

program
  .option('-a, --action [action]', 'action encode or decode', '')
  .option('-s, --shift [number]', 'shift size', '')
  .option('-i, --input [file]', 'input file path', '')
  .option('-o, --output [file]', 'output file path', '')
program.parse(process.argv);

const options = program.opts();
const { action, shift, input, output } = options;
if (action) {
  caesar.setAction(action);
}
if (shift) {
  caesar.setShift(+shift);
}
if (input) {
  caesar.setInput(input);
}
if (output) {
  caesar.setOutput(output);
}
caesar.start()


// $ node my_caesar_cli -a encode -s 7 -i "./input.txt" -o "./output.txt"


