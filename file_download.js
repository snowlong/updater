const https = require('https')
const fs = require('fs')

const requestPath = 'https://s3-ap-northeast-1.amazonaws.com/m2-es/update_list.csv'
const distPath = 'data/csv/update_list.csv'

const download = (url, dest, cb) => {
  const file = fs.createWriteStream(dest)
  const request = https.get(url, (response) => {
    response.pipe(file)
    file.on('finish', ()=> {
      file.close(cb)
    })
  }).on('error', (err) => {
    fs.unlink(dest)
    if(cb) cb(err.message)
  })
}

const csvFile = download(requestPath, distPath)

