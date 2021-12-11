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
    console.log(Date() + ' ' + req.ip)
    res.sendFile(__dirname + "\\index.html");
})

app.post('/', function(req, res){
    const urlNumber = req.body['urlNumber']
    console.log(Date() + ' ' + req.ip + ' : ' + urlNumber)

    fs.exists('./public/' + urlNumber, function(exist){
        if(exist){
            fs.readFile('./public/' + urlNumber + '/page.json', (err, data) =>{
                if (err) throw err;
                let key = JSON.parse(data);
                res.json(key)
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
                    const temp = ($('.lazyload').first().attr('data-src')).split('/')
                    const imgUrl = temp[4]
                    const type = temp[5].split('.')[1] 
                    let key = {
                        pages: pages,
                        type: type
                    }   

                    fs.mkdirSync('./public/' + urlNumber)
                    fs.writeFileSync('./public/' + urlNumber + '/page.json', JSON.stringify(key))
                    for(let p=1; p<=parseInt(pages); ++p){
                        download('https://i.nhentai.net/galleries/' + imgUrl + '/' + p.toString() + '.'+ type, './public/' + urlNumber + '/' + p.toString() + '.' + type)
                    }
                    res.json(key)
                }
            })
        }
    })
})

app.listen(80)