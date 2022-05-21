const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));

function recursiveWriteLine() {
  rl.question('Write text\n', (answer) => {
    if (answer === 'exit') {
      return rl.close();
    }
    file.write(`${answer}\n`);
    recursiveWriteLine();
  });
}

process.on('exit', () => output.write('Good luck!'));

recursiveWriteLine();
