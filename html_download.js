const fs = require('fs')
const parse = require('csv-parse')
const exec = require('child_process').exec
const rimraf = require('rimraf')

const listFilePath = 'data/csv/update_list.csv'
const htmlFilePath = 'data/html/'
const timeout = 10

rimraf(htmlFilePath + '*', (error) => {
  if (error) {
    console.log('error :' + error);
    return
  }
  console.log('clean directory: ' + htmlFilePath);

})

let index = 0;
fs.createReadStream(listFilePath)
  .pipe(parse({}))
  .on('data', (csvrow) => {
    exec('curl --max-time ' + timeout + ' ' + csvrow[0], function (error, stdout, stderr) {
      const distPath = htmlFilePath + index
      if (stdout) {
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath);
        }
        fs.writeFileSync(distPath + '/index.html', stdout);
      }
      // console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      index++;
    });
  })