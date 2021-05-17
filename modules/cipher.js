const streamer = require('./streamer');
const fs = require('fs')
module.exports = class {
  _shift = null;
  _action = null;
  constructor() {
    this.baseString = 'abcdefghijklmnopqrstuvwxyz'.split('');
    this.input = '';
    this.output = '';
  };
  error = () => process.stderr.write("missing some properties");
  setAction = action => this._action = action;
  setShift = number => this._shift = number;
  setInput = input => this.input = input;
  setOutput = output => this.output = output;
  start = () => {
    if ((this._action !== 'encode' && this._action !== 'decode') || this._shift === null) {
      this.error();
      return
    }
    const cyphering = chunk => this[`_${this._action}`](chunk);
    if (!fs.existsSync(this.output)) {
      this.output = process.stdout;
    }
    if (!fs.existsSync(this.input)) {
      this.input = process.stdin;
      this.input.resume();
      this.input.setEncoding('utf8');
      process.stdout.write('write something here:\n')

    }
    streamer({
      input: this.input,
      output: this.output,
      handler: cyphering
    })
  }
  _isUpperCase = sym => sym.toUpperCase() === sym ? true : false;
  _indexDefiner = (currentIndex) => {
    if ((this._action === 'encode' && this._shift > 0) ||
      (this._action === 'decode' && this._shift < 0)) {
      return currentIndex > this.baseString.length - 1
        ? this._indexDefiner(currentIndex - this.baseString.length)
        : this.baseString[currentIndex];
    }
    if ((this._action === 'encode' && this._shift < 0) ||
      (this._action === 'decode' && this._shift > 0)) {
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
    if (this.input === 'encode' && this._shift < 0) return this._decode(a);
    const message = a.split('').map((sym) => this._maper(sym));
    return message.map(el => {
      if (typeof el === 'object') {
        const currentIndex = el.index + this._shift;
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
    if (this.input === 'decode' && this._shift < 0) return this._encode(a);
    const message = a.split('').map((sym) => this._maper(sym));
    return message.map(el => {
      if (typeof el === 'object') {
        const currentIndex = el.index - this._shift;
        const currentSymb = this._indexDefiner(currentIndex)
        return el.isUpperCase ? currentSymb.toUpperCase() : currentSymb
      }
      else {
        return el;
      }
    }).join('');

  };
};