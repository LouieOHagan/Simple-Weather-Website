document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/weather?q=", currentWeatherResults));
document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/forecast?q=", forecastResults));
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

const enterKeySearch = document.getElementById("searchInput");
enterKeySearch.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchFunction("https://api.openweathermap.org/data/2.5/weather?q=", currentWeatherResults);
        searchFunction("https://api.openweathermap.org/data/2.5/forecast?q=", forecastResults);
    }
});

function searchFunction(link, setFunction){
    // Gets search box value and converts units to metric to be added to url
    let userInput = document.getElementById("searchInput").value;  
    // Removes spaces from search box value and replaces with comma so link doesnt return 404.  
    userInput = userInput.replace(/\s/g,',');
    // If userInput box is empty and user tries to search, returns error asking to enter city name
    if(!userInput){
        onError("emptyInput");
    }
    let units = "&units=metric";

    let url = link + userInput + units + apiKey;    // adds endpoint, API Key and UserInput together to form url to be called

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);                     // Initializes request (request = xhr variable)

    xhr.onload = function() {
        if(this.status === 200){                    // Only checks if status = 200 as onload only runs if readyState = 4 already
            onSuccessfulSearch();
            setFunction(xhr.responseText);
        } else if (this.status === 404){
            onError("404");
        }
    };
    
    xhr.send();                             // Sends request to server
}

// Recieves Data from searchFunction for current weather in specified location
function currentWeatherResults(weatherData) {
    weatherData = JSON.parse(weatherData);  // Parses incoming data (weatherData) into JS Object Format (JSON) 
    
    let output = "";

    output += `<div class="row">
            <div id="middle" class="col-11 col-md-8 currentWeatherCard">

                <div class="row location">
                    <div class="col col-12">
                        <h2>${weatherData.name}, ${weatherData.sys.country}</h2> <hr>
                    </div>
                </div>

                <div class="row weatherMain">
                <!-- Weather Icon-->
                    <div class="col col-6">
                        <img src="./assets/images/forecast-icons/${weatherData.weather[0].icon}.png" alt="Weather Icon">
                    </div>
                <!-- Temperature and Weather Description-->
                    <div class="col col-6">
                        <h2>${Math.round(weatherData.main.temp)}&#8451;</h2>
                        <p>${weatherData.weather[0].main}</p>
                    </div>
                </div>

                <div class="row sunTimes">
                <!-- Sun Rise Icon and Time-->
                    <div class="col col-5">
                        <h2><img src="./assets/images/sun-rise-time.png" alt="Wind"> ${sunRiseTime(weatherData.sys.sunrise, weatherData.timezone)}</h2>
                    </div>
                <!-- Sun Set Icon and Time-->
                    <div class="col col-5">
                        <h2><img src="./assets/images/sun-set-time.png" alt="Wind"> ${sunSetTime(weatherData.sys.sunset, weatherData.timezone)}</h2>
                    </div>
                </div>

                <div class="row weatherForecasts">
                <!-- Wind Icon and Speed-->
                    <div class="col col-4">
                        <h2><img src="./assets/images/wind-speed.png" alt="Wind"> ${msToKMH(weatherData.wind.speed)} <span class="unit">km/h</span></h2>
                    </div>
                <!-- Humidity Icon and Humidity-->
                    <div class="col col-4">
                        <h2><img src="./assets/images/humidity.png" alt="Humidity"> ${weatherData.main.humidity}<span class="unit">&#37;</span></h2>
                    </div>
                <!-- Rain Icon and Precipitation -->
                    <div class="col col-4">
                        <h2><img src="./assets/images/precipitation.png" alt="Rain"> ${ifRaining(weatherData.rain)}<span class="unit">mm</span></h2>
                    </div>
                </div>
                
            </div>
        </div>
                `;
    document.getElementById("currentResults").classList.add("main-section");
    document.getElementById("currentResults").innerHTML = output;
}

function onSuccessfulSearch(){
    document.getElementById("ifError").innerHTML = '';
    document.getElementById("searchInput").classList.remove("ifErrorBorder");
    document.getElementById("hidden").style.visibility = "initial";
    document.getElementById('currentResults').scrollIntoView({behavior: "smooth"});
}

function onError(errorType){
    if(errorType === "404") {
        document.getElementById("ifError").innerHTML = `<p class="emptyTextError">Location Not Found...
                                                                <span class="mistake">Think this is a mistake ? Let Us Know <a href="#" target="_blank">Here!</a></span>
                                                            </p>
                                                            `;
    } else if(errorType === "emptyInput") {
        document.getElementById("ifError").innerHTML = `<p class="emptyTextError">Please Enter Valid City Name...</p>`;
    }

    document.getElementById("searchInput").classList.add("ifErrorBorder");
    document.getElementById("currentResults").classList.remove("main-section");
    document.getElementById("currentResults").innerHTML = '';
    document.getElementById("hidden").style.visibility = "hidden";
}

// Recieves data from searchFunction for 5 day weather forecast with 3 hour intervals in specified location
function forecastResults(forecastData) {
    forecastData = JSON.parse(forecastData);    // Parses incoming data (forecastData) into JS Object Format (JSON) 
    let list = document.getElementById("myDIV");
    let cardTime = list.getElementsByClassName("cardTime");
    let cardImg = list.getElementsByClassName("cardImg");
    let cardTemp = list.getElementsByClassName("cardTemp");
    let cardWeather= list.getElementsByClassName("cardWeather");
    let cardRain = list.getElementsByClassName("cardRain");
    let cardHumidity = list.getElementsByClassName("cardHumidity");
    let cardWind = list.getElementsByClassName("cardWind");
    let i;
    for(i = 0; i < 40; i++) {
        cardTime[i].innerHTML = `${forecastDay(forecastData.list[i].dt, forecastData.city.timezone)}`;
        cardImg[i].innerHTML = `<img src="./assets/images/forecast-icons/${forecastData.list[i].weather[0].icon}.png" alt="Wind">`;
        cardTemp[i].innerHTML = `${Math.round(forecastData.list[i].main.temp)}&#8451;`;
        cardWeather[i].innerHTML = `${forecastData.list[i].weather[0].main}`;
        cardRain[i].innerHTML = `<img src="./assets/images/precipitation.png" alt="Rain">${ifRaining(forecastData.list[i].rain)}mm`;
        cardHumidity[i].innerHTML = `<img src="./assets/images/humidity.png" alt="Humidity">${forecastData.list[i].main.humidity}&#37;`;
        cardWind[i].innerHTML = `<img src="./assets/images/wind-speed.png" alt="Wind Speed">${msToKMH(forecastData.list[i].wind.speed)} km/h`;
    }
}

// Gets every 3 hours time [for next 5 days] from forecastResults function and changes to display "Day of Week & Time"
function forecastDay(timestamp, timezone){
    let forecastDay = new Date((timestamp + timezone) * 1000);
    let words = forecastDay.toString().split(' ')
    let day = words[0]
    let dayTime = words[4].slice(0, 5)

    return `${day} ${dayTime}`;
} 

// Converts wind speed from m/s to km/h (* 3.6) & limits result to 1 decimal place.
function msToKMH(wind) {
    return  (wind * 3.6).toFixed(1);
}

// Takes time that sun rises, converts to local timezone and returns the hours and minutes only.
function sunRiseTime(sunRiseValue, timezoneValue) {
    // Adds sun rise time & timezone unix values, converts to timestamps and converts seconds to milliseconds (* 1000)
    let sunrise = new Date((sunRiseValue + timezoneValue) * 1000);
    let sunRiseHours = sunrise.getHours();          // Variable getting hours value from timestamp
    let sunRiseMinutes = sunrise.getMinutes();      // Variable getting minutes value from timestamp

    // adds 0 in front of any number below 10 as by default would appear 6:8 rather than 06:08
    if(sunRiseHours < 10){
        sunRiseHours = `0${sunRiseHours}`;
    }

    if(sunRiseMinutes < 10){
        sunRiseMinutes = `0${sunRiseMinutes}`;
    }

    let sunRiseTime = `${sunRiseHours}:${sunRiseMinutes}`;

    return sunRiseTime;
}

// Takes time that sun sets, converts to local timezone and returns the hours and minutes only.
function sunSetTime(sunSetValue, timezoneValue){
    // Adds sun set time & timezone unix values, converts to timestamps and converts seconds to milliseconds (* 1000)
    let sunset = new Date((sunSetValue + timezoneValue) * 1000);
    let sunSetHours = sunset.getHours();            // Variable getting hours value from timestamp
    let sunSetMinutes = sunset.getMinutes();        // Variable getting minutes value from timestamp  

    // adds 0 in front of any number below 10 as by default would appear 6:8 rather than 06:08
    if(sunSetMinutes < 10){
        sunSetMinutes = `0${sunSetMinutes}`;
    } 

    if(sunSetHours < 10){
        sunSetHours = `0${sunSetHours}`;
    }

    let sunSetTime = `${sunSetHours}:${sunSetMinutes}`;

    return sunSetTime;
}

// Checks if rain parameters is defined as API only displays calculated data (not raining = no rain parameter in API Response)
function ifRaining(rain){
    if(rain !== undefined){
        // 1h & 3h wrapped in square brackets as parameter begins with number and was throwing errors without square brackets.
        if(rain["1h"] !== undefined) {
            return rain["1h"]; 
        } 
        
        if (rain["3h"] !== undefined) {
            return rain["3h"]; 
        }
    // If not raining and rain parameter is undefined, returns 0mm precipitation
    } else{
        return "0";
    }
}