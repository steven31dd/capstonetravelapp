let Data = {};
const resultID = document.getElementById('result-data');

function handleSubmit(event) {
    event.preventDefault();
    console.log("Begin Submission");
    // check what text was put into the form field
    let location = document.getElementById('destination').value;
    let start = document.getElementById('date-Departure').value;
    let end = document.getElementById('date-Return').value;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const TravelTime = endDate.getTime() - startDate.getTime();
    const daysInTravel = `${TravelTime / (1000 * 60 * 60 *24)} days`;

    postTrip('http://localhost:8080/createTrip', { Location: location, Start : startDate, End: endDate, Duration: daysInTravel })

    UpdateDate(startDate, endDate, daysInTravel, location);

    getGeo(`http://localhost:8080/getGeographics`)
      .then(async (data) =>{
        getWeather(`http://localhost:8080/getWeather`)
          .then(async (weatherData) =>{
            console.log(weatherData.weather);
            UpdateWeatherResult(weatherData);

          })
        })

    getImage(`http://localhost:8080/getImage`)
      .then(async (imgData) => {
        UpdateImageResult(imgData);
      })

}

async function postTrip(url, tripData){
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripData)
  });
}

const getGeo = async(url) => {
  const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
    });
      try{
        const data = await res.json();
        return;

      }catch{
        ResultError(`GEO: ${res.statusText}`);
      }
}

const getTripData = async(url) => {
  const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
    });
      try{
        const data = await res.json();
        return data;

      }catch{
        ResultError(`UpdateData: ${res.statusText}`);
      }
}

const getWeather = async (url) => {
    const res = await fetch(url ,{
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json:charset=utf-8'
        }
    });
    try{
      const data = await res.json();
      console.log(`weather response: ${data}`)
      return data;

    }catch{
      ResultError(`WEATHER: ${res.statusText}`);
    }
}

const getImage = async (url) =>{
  const res = await fetch(url , {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    try{
      const data = await res.json();

      return data;
    }catch{
      ResultError(`IMAGE: ${res.statusText}`);
    }
}

function ResultError(msg){
  if(msg !== 'OK')
  {
    const el_error = document.createElement('p');

    el_error.innerHTML = msg;
    resultID.append(el_error);
  }
}

function UpdateWeatherResult(weatherData){
  let resultFragment = document.createDocumentFragment();

  let result_Weather = document.createElement('p');

  const weatherHTML = `Temperature: ${weatherData.temp} <br/> Description: ${weatherData.weather}`;

  result_Weather.innerHTML = weatherHTML;

  resultFragment.append(result_Weather);

  resultID.append(resultFragment);
}

function UpdateDate(begin, end, duration, location){
  let resultFragment = document.createDocumentFragment();

  let result_Header = document.createElement('h3');
  let result_Date = document.createElement('p');

  result_Header.innerHTML = location;

  const dateHTML = `Start: ${begin} <br/> End: ${end} <br/> Travel time: ${duration}`;
  result_Date.innerHTML = dateHTML;

  resultFragment.append(result_Header);
  resultFragment.lastChild.append(result_Date);

  resultID.append(resultFragment);
}

function UpdateImageResult(imageData){
  let resultFragment = document.createDocumentFragment();

  let result_Image = document.createElement('img');

  result_Image.src = imageData.source;
  result_Image.alt = imageData.location;

  resultFragment.append(result_Image);


  resultID.append(resultFragment);

}

export { handleSubmit }
