
const commandline = require('./modules/commands');
const CipheringMachine = require('./modules/cipher');

const caesar = new CipheringMachine();
commandline(caesar);
caesar.start();


