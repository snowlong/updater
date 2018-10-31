const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;

const htmlFilePath = 'data/html/'
const distJSONPath = 'data/json/'
let index = 0;

const convertHTMLToJSON = (path) => {
  if (!path) return;

  rimraf(distJSONPath + '*', (error) => {
    if (error) {
      console.log('error :' + error);
      return
    }
    console.log('clean directory: ' + distJSONPath);
  
  })

  fs.readFile(path, (err, data) => {
    if (err) return;

    const dom = (new JSDOM(data));
    const documentObject = {
      "title": dom.window.document.querySelector("title").textContent,
      "body": dom.window.document.querySelector("body").textContent
    }
    const documentJSON = JSON.stringify(documentObject)
    // console.log(documentJSON);
    const distPath = distJSONPath  + index
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath);
    }
    fs.writeFileSync(distPath + '/index.json', documentJSON)
    index++;



    

  })
}

const eachDirectory = (dir) => {
  const filenames = fs.readdirSync(dir)

  filenames.forEach((filename) => {
    const fullPath = path.join(dir, filename)
    const stats = fs.statSync(fullPath)
    if (stats.isFile()) {
      console.log(fullPath)
      convertHTMLToJSON(fullPath)
    } else if (stats.isDirectory()) {
      eachDirectory(fullPath)
    }
  })
}
eachDirectory(htmlFilePath)