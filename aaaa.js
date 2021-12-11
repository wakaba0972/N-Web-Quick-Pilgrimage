var fs = require("fs")
var request = require("request")
const download = (url, path) => {
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(path))
    })
}

download()