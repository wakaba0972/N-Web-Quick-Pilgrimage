var request = require("request")
var express = require("express")
var fs = require("fs")

var app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '\\aaa2.html')
})

app.get('/img', function(req, res){
    console.log('ji')
    var requestSettings = {
        url: 'https://i.nhentai.net/galleries/1217339/1.jpg',
        method: 'GET',
        encoding: 'base64'
    };
    request(requestSettings, (err, res2, data) => {
        res.end(data);
    })
})


app.listen(80)
