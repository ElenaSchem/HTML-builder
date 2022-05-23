const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');

const styles = path.join(__dirname, 'styles');
const createStyle = fs.createWriteStream(path.join(projectDist, 'style.css'));

const currentAssets = path.join(__dirname, 'assets');
const assetsDir = path.join(__dirname, 'project-dist', 'assets');

const components = path.join(__dirname, 'components');
const createIndex = fs.createWriteStream(path.join(projectDist, 'index.html'));

fs.access(projectDist, fs.constants.F_OK, (error) => {
  console.log(`${projectDist} ${error ? 'not exist' : 'exist'}`);
  fs.mkdir(assetsDir, { recursive: true }, (error) => {
    if (error) return console.error(error.message);
    console.log('Project-dist created successfully');
    createStyleCss();
    createAssets(currentAssets, assetsDir);
    createIndexHtml();
  });
});

function createStyleCss() {
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
  fs.access(assetsDir, fs.constants.F_OK, (error) => {
    console.log(`${assetsDir} ${error ? 'not exist' : 'exist'}`);
    fs.mkdir(assetsDir, { recursive: true }, (error) => {
      if (error) return console.error(error.message);
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
  let newHtmlText = '';
  const readTemplate = fs.createReadStream(path.join(__dirname, 'template.html'));
  readTemplate.on('data', result => {
    newHtmlText = result.toString();
    fs.readdir(components, { withFileTypes: true }, (error, result) => {
      if (error) return console.error(error.message);
      result.forEach(file => {
        if (path.extname(file.name) === '.html') {
          fs.readFile(path.join(components, file.name), (error, data) => {
            if (error) return console.error(error.message);
            newHtmlText = newHtmlText.replace(`{{${file.name.slice(0, -5)}}}`, data.toString());
            createIndex.write(newHtmlText);
          });
        }
      });
    });
  });
}