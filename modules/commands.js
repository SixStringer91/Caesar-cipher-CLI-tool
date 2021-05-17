const path = require("path");
const program = require('commander');

module.exports = (caesar) => {
  program
  .option('-a, --action [action]', 'action encode or decode', '')
  .option('-s, --shift <number>', 'shift size', '')
  .option('-i, --input [file]', 'input file path', '')
  .option('-o, --output [file]', 'output file path', '')
program.parse(process.argv)
const options = program.opts();
const { action, shift, input, output } = options;
if (action) {
  caesar.setAction(action);
}
if (shift) {
  caesar.setShift(+shift);
}
if (input) {
  caesar.setInput(path.resolve(__dirname,'..', input));
}
if (output) {
  caesar.setOutput(path.resolve(__dirname,'..', output));
}
}