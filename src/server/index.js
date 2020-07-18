var path = require('path')
const express = require('express')
//const SEASecure = require('./SEASecureAPI.js')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors());


dotenv.config();


app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/getGeographics', (req, res) => {
  const url = `http://api.geonames.org/postalCodeSearchJSON?placename=${req.query.city}&username=${process.env.Geo_User}`;
    get(url).then(response => {
      res.send(JSON.stringify(response.data.geonames[0]));
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getWeather', (req, res) => {
  const url = `https://api.weatherbit.io/v2.0/current?lat=${req.query.lat}&long=${req.query.long}&key=${process.env.WBit_Key}`;
    get(url).then(response =>{
      res.send(JSON.stringify(response.data))
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getImage', (req, res) => {
  const url = `https://pixabay.com/api/?key=${process.env.pBay_Key}&q=${req.query.img}&image_type=photo`;
    axios.get(url).then(response =>{
      res.send(JSON.stringify(response.data.hits[0]));
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error has occured"}));
    })
})
