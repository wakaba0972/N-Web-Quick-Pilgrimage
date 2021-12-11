/// <reference path="./typings/index.d.ts" />

var cheerio = require("cheerio")
var request = require("request")
var express = require("express")
var fs = require("fs")

const download = (url, path) => {
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(path))
    })
}

var app = express()
app.use(express.json())
app.use('/public', express.static(__dirname + '\\public'))

app.get('/', function(req, res){
    console.log(req.ip)
    res.sendFile(__dirname + "\\index.html");
})

app.post('/', function(req, res){
    const urlNumber = req.body['urlNumber']
    console.log(req.ip + ' : ' + urlNumber)

    fs.exists('./public/' + urlNumber, function(exist){
        if(exist){
            fs.readFile('./public/' + urlNumber + '/page.txt', (err, pages) =>{
                res.end(pages)
            })
        }
        else{
            request('https://nhentai.net/g/' + urlNumber + '/', (err, res2, body) =>{
                const $ = cheerio.load(body)
                if($('h1').text() == '404 – Not Found'){
                    res.end('0')
                }
                else{
                    const pages = $('.name').last().text()
                    const imgUrl = ($('.lazyload').first().attr('data-src')).split('/')[4]

                    fs.mkdirSync('./public/' + urlNumber)
                    fs.writeFileSync('./public/' + urlNumber + '/page.txt', pages)
                    for(let p=1; p<=parseInt(pages); ++p){
                        download('https://i.nhentai.net/galleries/' + imgUrl + '/' + p.toString() + '.jpg', './public/' + urlNumber + '/' + p.toString() + '.jpg')
                    }
                    res.end(pages)
                }
            })
        }
    })
})

app.listen(80)