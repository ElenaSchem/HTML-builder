const fs = require('fs');
const path = require('path');
const mainFolder = path.join(__dirname, 'secret-folder');

fs.readdir(mainFolder, { withFileTypes: true }, (error, files) => {
  if (error) return console.error(error.message);
  for (let file of files) {
    if (file.isFile()) {
      fs.stat(mainFolder, file.name, (error, stats) => {
        if (error) return console.error(error.message);
        let name = path.basename(file.name, path.extname(file.name));
        let ext = path.extname(file.name).slice(1);
        let size = stats.size / 1000;
        console.log(`${name} - ${ext} - ${size}kb`);
      });
    }
  }
});