const apiKey = "194f452e9fcc6891d991dfc10caa1c42";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const weather = "weather?";
const onecall = "onecall?";
const currentCityDetail = document.querySelector("#currentWeatherDetail")

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// get current city weather

let lastCall = null;
const displayCurrentWeather = function(cityName, date, temp, wind, humidity, uv) {
    let wHead = document.querySelector('#currentWeatherHeader');
    wHead.textContent = `${cityName} (${date})`;
    let pTemp = document.createElement('p');
    pTemp.textContent = `Temp: ${temp}°F`;
    let pWind = document.querySelector()
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
        })
}




// function to execute when new city is searched


// get current city weather


// get forcast and uv index

