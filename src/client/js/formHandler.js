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

    Data.city = location;
    Data.DateStart = startDate;
    Data.DateEnd = endDate;

    const TravelTime = endDate.getTime() - startDate.getTime();
    Data.DaysToTravel = `${TravelTime / (1000 * 60 * 60 *24)} days`;

    getGeo(`http://localhost8080/getGeographics?city=${Data.city}`)
      .then(UpdateResult());

}

const getGeo = async(url) => {
  await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
    })
      .then(res => res.json())
        .then(async res => {
          Data.temperature = res.data[0].temp;
          Data.weatherDesc = res.data[0].weather.description;
          Data.population = res.population;
          await getWeather(`http://localhost:8080/getWeather?lat=${res.lat}&long=${res.long}`)
  }).catch(error =>{
      console.log(error)
  })
}

const getWeather = async (url) => {
    await fetch(url ,{
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json:charset=utf-8'
        }
    })
    .then(res => res.json())
    .then(async res =>{
        Data.weatherTemp = res.data[0].temp;
        Data.weatherDesc = res.data[0].weather.description;
        await getImage(`http://localhost:8080/getImage?img=${Data.city}`)
    })
    .catch(error =>{
        console.log(error)
    })
}

const getImage = async (url) =>{
    await fetch(url , {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    .then(res => res.json())
    .then(res => {
        Data.img = res.webformatURL;
    })
    .catch(error => {
        console.log(error)
    })
}

function UpdateResult(){
  let resultFragment = document.createDocumentFragment();

  let result_Header = document.createElement('h3');
  let result_Image = document.createElement('img');
  let result_Date = document.createElement('p');
  let result_Weather = document.createElement('p');

  result_Header.innerHTML = Data.city;

  result_Image.src = Data.img;

  const dateHTML = `Start: ${Data.DateStart} <br/> End: ${Data.DateEnd} <br/> Travel time: ${Data.DaysToTravel}`;
  result_Date.innerHTML = dateHTML;

  const weatherHTML = `Temperature: ${Data.weatherTemp} <br/> Description: ${Data.weatherDesc}`;
  result_Weather.innerHTML = weatherHTML;

  resultFragment.append(result_Header);
  resultFragment.lastChild.append(result_Image);
  resultFragment.lastChild.append(result_Date);
  resultFragment.lastChild.append(result_Weather);

  resultID.append(resultFragment);

}

export { handleSubmit }
