const apiKey = "194f452e9fcc6891d991dfc10caa1c42";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
const weather = "weather?";
const onecall = "onecall?";
const currentCityDetail = document.querySelector("#currentWeatherDetail");
const searchBox = document.querySelector('#searchBox');

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// get current city weather

let lastCall = null;

    const uviScale = (uv) => {
        if (uv <3) {
            return 'low';
        }   else
        if (uv <6) {
            return 'moderate';
        }   else {
            return 'severe';
        }
    }

const displayCurrentWeather = function(cityName, date, temp, wind, humidity, uv) {
    let wHead = document.querySelector('#currentWeatherHeader');
    wHead.textContent = `${cityName} (${date})`;
    let pTemp = document.createElement('p');
    pTemp.textContent = `Temp: ${temp}°F`;
    let pWind = document.createElement('p');
    pWind.textContent = `Wind: ${wind}MPH`;
    let pHumidity = document.createElement('p');
    pHumidity.textContent = `Humidity: ${humidity} %`;
    let pUV = document.createElement('p');
    pUV.textContent = `UV Index: ${uv}`;

        currentCityDetail.innerHTML = '';
        currentCityDetail.appendChild(pTemp);
        currentCityDetail.appendChild(pWind);
        currentCityDetail.appendChild(pHumidity);
        currentCityDetail.appendChild(pUV);
}

const forecast = ( lat, lon ) => {
    return fetch(apiUrl + onecall +
        [
            'lat=' + lat,
            'lon=' + lon,
            'exclude=' + ['alerts', 'hourly', 'minutely'].join(','),
            'units=imperial',
            'appid=' + apiKey].join('&')
        ).then(res => res.json()
        ).then(json => {
            console.log(json);
            lastCall = json;
            return json;
        })
}

const weatherCall = function(cityName) {
    return fetch(apiUrl + weather +
        [
            `q=${cityName}`,
            `appid=${apiKey}`
        ].join('&'))
        .then( res => res.json())
        .then (o => {
            lastCall = o;
            console.log(o);
            return o;
        })
}

// function to execute when new city is searched

searchBox.querySelector('button').addEventListener('click', (ev) => {
    ev.preventDefault();
    console.log(this);
    let searchedCity = searchBox.querySelector('input').value;
    console.log(`search city: ${searchedCity}`);
    weatherCall(searchedCity)
    .then(json => {
        return forecast(json.coord.lat, json.coord.lon)
    }).then(blob => {
        let a = blob.current;
        displayCurrentWeather(searchedCity, Date(), a.temp, a.wind_speed, a.humidity, a.uvi);
    })
});


// get current city weather


// get forcast and uv index

