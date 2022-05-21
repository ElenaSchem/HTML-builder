const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (error, files) => {
  if (error) return console.error(error.message);
  for (let file of files) {
    fs.stat(path.join(__dirname, 'secret-folder', file), (error, stats) => {
      if (error) return console.error(error.message);
      const name = path.basename(file, path.extname(file));
      const ext = path.extname(file).slice(1);
      const size = stats.size / 1000;
      console.log(`${name} - ${ext} - ${size}kb`);
    });
  }
});