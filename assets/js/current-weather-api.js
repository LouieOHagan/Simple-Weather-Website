document.getElementById("searchButton").addEventListener("click", searchFunction); 
const link = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction(){
    // Gets search box value and converts units to metric to be added to url
    let userInput = document.getElementById("searchInput").value + "&units=metric";   
    // Removes spaces from search box value and replaces with comma so link doesnt return 404.  
    userInput = userInput.replace(/\s/g,',');

    let url = link + userInput + apiKey;    // adds endpoint, API Key and UserInput together to form link to be called

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);             // Initializes request (request = xhr variable)
    
    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            resultsFunction(xhr.responseText);
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

function resultsFunction(weatherData) {
    weatherData = JSON.parse(weatherData);  // Parses incoming data (weatherData) into JS Object Format (JSON) 
    
    let output = "";

    output += `
                <div class="weatherForecast">
                    <h1>${weatherData.name}</h1>
                    <ul>
                        <li>Weather: ${weatherData.weather[0].main}</li>
                        <li>Temperature: ${Math.round(weatherData.main.temp)}&#8451;</li>
                        <li>Sun Rise: ${sunRiseTime(weatherData.sys.sunrise, weatherData.timezone)}</li>
                        <li>Sun Set: ${sunSetTime(weatherData.sys.sunset, weatherData.timezone)}</li>
                        <li>Humidity: ${weatherData.main.humidity}&#37;</li>
                        <li>Wind Speed: ${msToKMH(weatherData.wind.speed)} km/h</li>
                    </ul>
                </div>
                `;

    document.getElementById("searchResults").innerHTML = output;
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