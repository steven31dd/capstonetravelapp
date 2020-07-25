var path = require('path')
const express = require('express')
//const SEASecure = require('./SEASecureAPI.js')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express()

let planData = {};


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
  const ServerStart = new Date();
    console.log(`${ServerStart.getDate()} : @${ServerStart.getHours()} (Military)`);
    console.log('Server listening on port 8080!')
})

app.post('/createTrip', (req, res) => {
  let newData = req.body;
  let newEntry = {
    location: newData.Location,
    startDate: newData.Start,
    endDate: newData.End,
    duration: newData.Duration
  }

  planData = newEntry;

  console.log(planData);
})

app.get('/getGeographics', (req, res) => {
  console.log('GET georaphics')
  const url = `http://api.geonames.org/postalCodeSearchJSON?placename=${planData.location}&maxRows=10&username=${process.env.Geo_User}`;
  console.log(url);
    fetch(url)
      .then(res => res.json())
        .then(response =>{
          console.log('Data From GeoNames[0]')
          console.log(response.postalCodes[0]);
          planData.Long = response.postalCodes[0].lng;
          planData.Lat = response.postalCodes[0].lat;
          res.send(true);
    })
    .catch(error => {
      res.send(JSON.stringify({error: error}));
    })
})

app.get('/getWeather', (req, res) => {
  console.log('GET weather');
  const url = `https://api.weatherbit.io/v2.0/current?lat=${planData.Lat}&lon=${planData.Long}&key=${process.env.WBit_Key}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          planData.temperature = response[1].temp;
          planData.description = response[0].weather.description;

          res.send({temp : planData.temperature, weather: planData.description});
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getImage', (req, res) => {
  console.log('GET Image')
  const url = `https://pixabay.com/api/?key=${process.env.pBay_Key}&q=${planData.location}&image_type=photo`;
  console.log(url);
    fetch(url).then(response =>{
      const result = response.data.hits[0].webformatURL;
      console.log(`Image result: ${result}`)
      planData.imgSource = result;
      res.send({ source: planData.imgSource, alternate: planData.location});
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error has occured"}));
    })
})

app.get('/getPlan', (req, res) => {
    res.send(planData);
})
