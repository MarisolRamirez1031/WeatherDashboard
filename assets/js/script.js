// get current city weather
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

var getCurrentCity = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=194f452e9fcc6891d991dfc10caa1c42";

    // making request to url
    fetch(apiUrl)
    .then(function(response) {
        console.log(response);
        response.json().then(function(data) {
            console.log(data);
        });
    });
}; 

getCurrentCity("Austin");

// function to execute when new city is searched


// get current city weather


// get forcast and uv index

