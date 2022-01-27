const apiKey = "194f452e9fcc6891d991dfc10caa1c42";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
const weather = "weather?";
const onecall = "onecall?";
const currentCityDetail = document.querySelector("#currentWeatherDetail");
const searchBox = document.querySelector('#searchBox');
const cityList = document.querySelector('#previouslySearched');

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

let lastCall = null;

const history = () => {
    localStorage['cityList'] = JSON.stringify([]);
    cityList.innerHTML = '';
}

if (localStorage.getItem('cityList') === null) {
    history();
}

const getCities = () => JSON.parse(localStorage['cityList']);

const hadCity = (cityName) => getCities().some(a => a.name === cityName);

const pushedCity = (cityName, coord) => {
    let citySearch = getCities();
    if(citySearch.every(a => a.name !== cityName))
    citySearch.push({name: cityName, coords: coord});
        localStorage['cityList'] = JSON.stringify(citySearch);
}

const updateHistory = () => {
    let citySearch = getCities();
    cityList.innerHTML = '';
    for (a of citySearch) {
        let b = document.createElement('button');
            b.textContent = a.name;
            b.classList.add('cityBttn');
            cityList.appendChild(b);
    }
}

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

    updateHistory();


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
    pUV.textContent = `UV Index: ${uv}`;

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


cityList.addEventListener('click', ev => {
    ev.preventDefault();
        if(ev.target.classList.contains('cityBttn')) {
            let citySearch = getCities();
            let x = citySearch.find(a => a.name === ev.target.textContent);
            forecast(x.coords.lat, x.coords.lon)
            .then(blob => {
                let a = blob.current;
                displayCurrentWeather(x.name, Date(), a.temp, a.pWind, a.humidity, a.uvi);
            })
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
        return forecast(json.coord.lat, json.coord.lon)
    }).then(blob => {
        let a = blob.current;
        displayCurrentWeather(searchedCity, Date(), a.temp, a.wind_speed, a.humidity, a.uvi);
    })
});
