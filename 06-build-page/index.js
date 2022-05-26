const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');

const currentAssets = path.join(__dirname, 'assets');
const assetsDir = path.join(__dirname, 'project-dist', 'assets');

fs.rm(projectDist, { recursive: true }, () => {
  fs.mkdir(assetsDir, { recursive: true }, (error) => {
    if (error) return console.error(error.message);
    console.log('Project-dist created successfully');
    createIndexHtml();
    createStyleCss();
    createAssets(currentAssets, assetsDir);
  });
});

function createStyleCss() {
  const styles = path.join(__dirname, 'styles');
  const createStyle = fs.createWriteStream(path.join(projectDist, 'style.css'));

  fs.readdir(styles, { withFileTypes: true }, (error, result) => {
    if (error) return console.error(error.message);
    result.forEach(file => {
      if (path.extname(file.name) === '.css') {
        fs.readFile(path.join(styles, file.name), (error, data) => {
          if (error) return console.error(error.message);
          createStyle.write(data);
        });
      }
    });
    console.log('Style.css created successfully');
  });
}

function createAssets(currentAssets, assetsDir) {
  fs.rm(assetsDir, { recursive: true }, () => {
    fs.mkdir(assetsDir, { recursive: true }, () => {
      fs.readdir(currentAssets, { withFileTypes: true }, (error, result) => {
        if (error) return console.error(error.message);
        result.forEach(file => {
          const currentFile = path.join(currentAssets, file.name);
          const newFile = path.join(assetsDir, file.name);
          if (file.isFile()) {
            fs.copyFile(currentFile, newFile, () => {});
          } else {
            createAssets(currentFile, newFile);
          }
        });
      });
    });
  });
}

function createIndexHtml() {
  const components = path.join(__dirname, 'components');
  const projectHTML = path.join(projectDist, 'index.html');
  const readTemplate = fs.createReadStream(path.join(__dirname, 'template.html'));
  
  let newHtmlText = '';
  readTemplate.on('data', result => {
    newHtmlText += result;
    fs.readdir(components, { withFileTypes: true }, (error, result) => {
      if (error) return console.error(error.message);
      result.forEach(file => {
        if (path.extname(file.name) === '.html') {
          fs.readFile(path.join(components, file.name), (error, data) => {
            if (error) return console.error(error.message);
            newHtmlText = newHtmlText.replace(`{{${file.name.toString().split('.').slice(0, -1)}}}`, data);
            const createIndex = fs.createWriteStream(projectHTML);
            createIndex.write(`${newHtmlText}\n`);
          });
        }
      });
    });
  });
}