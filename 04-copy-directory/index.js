const fs = require('fs');
const path = require('path');
const currentDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

fs.access(copyDir, fs.constants.F_OK, (error) => {
  console.log(`${copyDir} ${error ? 'not exist' : 'exist'}`);
  fs.mkdir(copyDir, { recursive: true }, (error) => {
    if (error) return console.error(error.message);
    fs.readdir(currentDir, { withFileTypes: true }, (error, result) => {
      if (error) return console.error(error.message);
      result.forEach(file => {
        fs.copyFile(path.join(currentDir, file.name), path.join(copyDir, file.name), (error) => {
          if (error) return console.error(error.message);
          console.log('File copied successfully');
        });
      });
    });
  });
});