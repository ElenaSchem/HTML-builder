const fs = require('fs');
const path = require('path');
const currentDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

fs.rm(copyDir, { recursive: true }, (error) => {
  if (error) return console.error(error.message);
  fs.mkdir(copyDir, { recursive: true }, (error) => {
    if (error) return console.error(error.message);
    fs.readdir(currentDir, { withFileTypes: true }, (error, result) => {
      if (error) return console.error(error.message);
      result.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(currentDir, file.name), path.join(copyDir, file.name), (error) => {
            if (error) return console.error(error.message);
          });
        }
      });
      console.log('File copied successfully');
    });
  });
});