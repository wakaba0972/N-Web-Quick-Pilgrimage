/// <reference path="../typings/index.d.ts" />

var fs = require("fs")
var cheerio = require("cheerio")
var request = require("request")
var express = require("express")
var compression = require("compression")

var app = express()
app.use(compression())
app.use(express.json())
app.use('/public', express.static(__dirname + '\\public'))

var download = (url, path) => {
    request(url).pipe(fs.createWriteStream(path))
}

app.get('/', function(req, res){
    console.log(Date() + ' ' + req.ip)
    res.sendFile(__dirname + "\\index.html")
})

app.post('/', function(req, res){
    const urlNumber = req.body['urlNumber']
    console.log(Date() + ' ' + req.ip + ' : ' + urlNumber)

    fs.exists('./public/' + urlNumber, function(exist){
        if(urlNumber == ''){
            res.end('Plese Enter Something')
        }
        else if(exist){
            fs.readFile('./public/' + urlNumber + '/page.json', (err, data) =>{
                if (err) throw err;
                let key = JSON.parse(data);
                res.json(key)
            })
        }
        else{
            request('https://nhentai.net/g/' + urlNumber + '/', (err, res2, body) =>{
                const $ = cheerio.load(body)
                const pages = $('.name').last().text()
                if($('h1').text() == '404 – Not Found'){
                    res.end('Please Enter Valid Number')
                }
                else if(pages > 100){
                    res.end('Too Many Pages!')
                }
                else{
                    const temp = ($('.lazyload').first().attr('data-src')).split('/')
                    const imgUrl = temp[4]
                    const type = temp[5].split('.')[1] 
                    let key = {
                        pages: pages,
                        type: type
                    }   
                    fs.mkdir('./public/' + urlNumber, () => {
                        fs.writeFile('./public/' + urlNumber + '/page.json', JSON.stringify(key), () => {     
                            let p = 1
                            let last = parseInt(pages)
                            let timer = setInterval(() => {
                                download('https://i.nhentai.net/galleries/' + imgUrl + '/' + p.toString() + '.'+ type, 
                                        './public/' + urlNumber + '/' + p.toString() + '.' + type)
                                if(++p > last){
                                    clearInterval(timer)
                                    res.json(key)
                                }
                            }, 100)
                        })
                    })
                }
            })
        }
    })
})

app.listen(80)