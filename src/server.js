var request = require("request")
var express = require("express")
var cheerio = require("cheerio")

var app = express()
app.use(express.json())
app.use('/public', express.static(__dirname + '\\public'))

app.get('/', (req, res) => {
    console.log(Date() + ' ' + req.ip)
    res.sendFile(__dirname + '\\client.html')
})

app.post('/sendNumber', function(req, res){
    const urlNumber = req.body['urlNumber']
    console.log(Date() + ' ' + req.ip + ' : ' + urlNumber)

    if(isNaN(parseInt(urlNumber))){
        res.end('Please Enter Valid Number')
        return
    }

    request('https://nhentai.net/g/' + urlNumber + '/', (err, res2, body) =>{
        const $ = cheerio.load(body)
        let pages = $('.name').last().text()

        if($('h1').text() == '404 – Not Found'){
            res.end('No Such Manga')
        }
        else{
            let imgElems = $('.lazyload')
            let imgUrls = imgElems.get().map(x => $(x).attr('data-src'))
            let galleryNumber =imgUrls[0].split('/')[4]

            var response = {}
            response['pages'] = pages
            response['galleryNumber'] = galleryNumber
            for(let i=1; i<=pages; ++i){
                response[i] = imgUrls[i].substr(-3)
            }
            res.json(response)
        }
    })
})

app.get('/image', (req, res) => {
    const requestSettings = {
        url: 'https://i.nhentai.net/galleries/' + req.query.parm,
        method: 'GET',
        encoding: 'base64'
    };
    request(requestSettings, (err, res2, data) => {
        res.end(data)
    })

})

const PORT = process.env.PORT || 3000;
app.listen(PORT)
