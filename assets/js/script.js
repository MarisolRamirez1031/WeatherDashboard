const apiKey = "194f452e9fcc6891d991dfc10caa1c42";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
const weather = "weather?";
const onecall = "onecall?";
const currentCityDetail = document.querySelector("#currentWeatherDetail");
const searchBox = document.querySelector('#searchBox');
const cityList = document.querySelector('#previouslySearched');
const localStorageKey = 'cities';
const forecastedList = document.querySelector('#forecastedDays')
const momentMDY = 'M/DD/YYYY';

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

let lastCall = null;

const history = () => {
    localStorage[localStorageKey] = JSON.stringify([]);
    cityList.innerHTML = '';
}

if (localStorage.getItem(localStorageKey) === null) {
    history();
}

const getCities = () => JSON.parse(localStorage[localStorageKey]);

const hadCity = (cityName) => getCities().some(a => a.name === cityName);

const pushedCity = (cityName, coord) => {
    let citySearch = getCities();
    if(citySearch.every(a => a.name !== cityName))
    citySearch.push({name: cityName, coords: coord});
        localStorage[localStorageKey] = JSON.stringify(citySearch);
}

const updateHistory = () => {
    let citySearch = getCities();
    cityList.innerHTML = '';
    for (a of citySearch) {
        let li = document.createElement('li')
        let b = document.createElement('button');
            b.textContent = a.name;
            b.classList.add('cityBttn');
            li.appendChild(b)
            cityList.appendChild(li);
    }
}

updateHistory();


    const uviScale = (uv) => 
    `<span class='uv-${(uv<3)?'low':(uv<6)?'moderate':'severe'}'>${uv}</span>`

// get current city weather
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
    pUV.innerHTML = `UV Index: ${uviScale(uv)}`;

        currentCityDetail.innerHTML = '';
        currentCityDetail.appendChild(pTemp);
        currentCityDetail.appendChild(pWind);
        currentCityDetail.appendChild(pHumidity);
        currentCityDetail.appendChild(pUV);
}

// get forcast and uv index

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

const showDailyWeatherR = days => {
    for (x of days) {
        let cards = document.createElement('div');
        cards.innerHTML = `<h4>${moment(x.dt * 1000).format(momentMDY)}<h4>
        <p><img src=https://openweathermap.org/img/w/${x.weather[0].icon}.png</p>
        <p class="bi bi-thermometer-sun"> Temp: ${x.temp.day}</p>
        <p class="bi bi-wind"> Wind: ${x.wind_speed}</p>
        <p class="bi bi-moisture"> Humidity: ${x.humidity} %</p>
        <p class="bi bi-sun-fill"> UV Index: ${x.uvi}</p>`;
        forecastedList.appendChild(cards);
    }
}
const showForecasted = (lat, lon, cityName) => {
    forecast(lat, lon).then(blob => {
        let a = blob.current;
        displayCurrentWeather(cityName, moment().format(momentMDY), a.temp, a.wind_speed, a.humidity, a.uvi);
        showDailyWeatherR(blob.daily.slice(1,6));
    });
}
cityList.addEventListener('click', ev => {
    ev.preventDefault();
        if(ev.target.classList.contains('cityBttn')) {
            let citySearch = getCities();
            let x = citySearch.find(a => a.name === ev.target.textContent);
            showForecasted(x.coords.lat, x.coords.lon, x.name);
        }
})

// function to execute when new city is searched
searchBox.querySelector('button').addEventListener('click', (ev) => {
    ev.preventDefault();
    console.log(this);
    let searchedCity = searchBox.querySelector('input').value;
    console.log(`search city: ${searchedCity}`);
    weatherCall(searchedCity)
    .then(json => {
        pushedCity(json.name, json.coord);
        updateHistory();
        showForecasted(json.coord.lat, json.coord.lon, json.name);
    });
});


// clear button functionality
document.querySelector('#clrBtn').addEventListener('click', ev => {
    history();
})