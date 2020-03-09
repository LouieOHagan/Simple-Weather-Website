document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/weather?q=", currentWeatherResults));
document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/forecast?q=", forecastResults));
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction(link, setFunction){
    // Gets search box value and converts units to metric to be added to url
    let userInput = document.getElementById("searchInput").value; // + "&units=metric";   
    // Removes spaces from search box value and replaces with comma so link doesnt return 404.  
    userInput = userInput.replace(/\s/g,',');
    // If userInput box is empty and user tries to search, returns error asking to enter city name
    if(!userInput){
        document.getElementById("ifError").innerHTML = `<h1>Please enter valid city name...</h1>`;
        return;
    }
    let units = "&units=metric";

    let url = link + userInput + units + apiKey;    // adds endpoint, API Key and UserInput together to form url to be called

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);             // Initializes request (request = xhr variable)

    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            setFunction(xhr.responseText);
        } else if (this.status === 404){
            document.getElementById("ifError").innerHTML = `
                                                            <p style="font-size: 0.95rem;"><span style="color:red;">Error: Location Not Found</span> <br>
                                                            Please ensure there is a comma inbetween any spaces you may have. <br>
                                                            Think this is a mistake ? Let Us Know <a href="#" target="_blank">Here</a>!</p>
                                                            `;
        }
    };
    
    xhr.send();                             // Sends request to server
}

// Recieves Data from searchFunction for current weather in specified location
function currentWeatherResults(weatherData) {
    weatherData = JSON.parse(weatherData);  // Parses incoming data (weatherData) into JS Object Format (JSON) 
    
    let output = "";

    output += `
                <div class="weatherForecast">
                    <h1>${weatherData.name}</h1>
                    <ul>
                        <li>Weather: ${weatherData.weather[0].main}</li>
                        <li>Temperature: ${Math.round(weatherData.main.temp)}&#8451;</li>
                        <li>Precipitation: ${ifRaining(weatherData.rain)}</li>
                        <li>Sun Rise: ${sunRiseTime(weatherData.sys.sunrise, weatherData.timezone)}</li>
                        <li>Sun Set: ${sunSetTime(weatherData.sys.sunset, weatherData.timezone)}</li>
                        <li>Humidity: ${weatherData.main.humidity}&#37;</li>
                        <li>Wind Speed: ${msToKMH(weatherData.wind.speed)} km/h</li>
                    </ul>
                </div>
                `;

    document.getElementById("currentResult").innerHTML = output;
}

// Recieves data from searchFunction for 5 day weather forecast with 3 hour intervals in specified location
function forecastResults(forecastData) {
    forecastData = JSON.parse(forecastData);    // Parses incoming data (forecastData) into JS Object Format (JSON) 

    let forecastOutput = "";
    let i;
    forecastOutput += `
                <div class="weatherForecast">
                    <h1>${forecastData.city.name}</h1>
                `;

    for (i = 0; i < forecastData.list.length; i++  ) {

        forecastOutput += ` 
                        <p>Day ${[i]}</p>
                        <ul>
                            <li>Time: ${forecastData.list[i].dt_txt}</li>
                            <li>Weather: ${forecastData.list[i].weather[0].main}</li>
                            <li>Precipitation: ${ifRaining(forecastData.list[i].rain)}</li>
                            <li>Temperature: ${Math.round(forecastData.list[i].main.temp)}&#8451;</li>
                            <li>Humidity: ${forecastData.list[i].main.humidity}&#37;</li>
                            <li>Wind Speed: ${msToKMH(forecastData.list[i].wind.speed)} km/h</li>
                        </ul>
                    </div>`;
    }

    document.getElementById("forecastResult").innerHTML = forecastOutput;
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
            return rain["1h"] + "mm"; 
        } 
        
        if (rain["3h"] !== undefined) {
            return rain["3h"] + "mm"; 
        }
    // If not raining and rain parameter is undefined, returns 0mm precipitation
    } else{
        return "0 mm";
    }
}