document.getElementById("searchButton").addEventListener("click", searchFunction); 
const link = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction(){
    // Gets search box value and converts units to metric to be added to url
    let userInput = document.getElementById("searchInput").value + "&units=metric";     
    let url = link + userInput + apiKey;    // adds endpoint, API Key and UserInput together to form link to be called

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);             // Initializes request (request = xhr variable)
    
    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            resultsFunction(xhr.responseText);
        } 
    };
    
    xhr.send();                             // Sends request to server
}

function resultsFunction(weatherData) {
    weatherData = JSON.parse(weatherData);  // Parses incoming data (weatherData) into JS Object Format (JSON)

    // Variable adding sunrise time and timezone unix values & converting them to timestamps
    let sunrise = new Date((weatherData.sys.sunrise + weatherData.timezone) * 1000);
    let sunRiseHours = sunrise.getHours();          // Variable getting hours value from timestamp
    let sunRiseMinutes = sunrise.getMinutes();      // Variable getting minutes value from timestamp
    let sunRiseTime;                                // declaring sun rise time variable to be called in if else statement

    if (sunRiseHours < 10 && sunRiseMinutes < 10) {
        sunRiseTime = `0${sunRiseHours}:0${sunRiseMinutes}`;
    } else if (sunRiseHours < 10){
        sunRiseTime = `0${sunRiseHours}:${sunRiseMinutes}`;
    } else if (sunRiseMinutes < 10) {
        sunRiseTime = `${sunRiseHours}:0${sunRiseMinutes}`;
    } else {
        sunRiseTime = `${sunRiseHours}:${sunRiseMinutes}`;
    }

    // Variable adding sunset time and timezone unix values & converting them to timestamps
    let sunset = new Date((weatherData.sys.sunset + weatherData.timezone) * 1000);
    let sunSetHours = sunset.getHours();            // Variable getting hours value from timestamp
    let sunSetMinutes = sunset.getMinutes();        // Variable getting minutes value from timestamp
    let sunSetTime;                                 // declaring sun rise time variable to be called in if else statement

    if(sunSetMinutes < 10){
        sunSetTime = `${sunSetHours}:0${sunSetMinutes}`;
    } else {
        sunSetTime = `${sunSetHours}:${sunSetMinutes}`;
    }
    
    let output = "";

    output += `
                <div class="weatherForecast">
                    <h1>${weatherData.name}</h1>
                    <ul>
                        <li>Weather: ${weatherData.weather[0].main}</li>
                        <li>Temperature: ${Math.round(weatherData.main.temp)}&#8451;</li>
                        <li>Sun Rise: ${sunRiseTime}</li>
                        <li>Sun Set: ${sunSetTime}</li>
                        <li>Humidity: ${weatherData.main.humidity}&#37;</li>
                        <li>Wind Speed: ${(weatherData.wind.speed * 3.6).toFixed(1)} km/h</li>
                    </ul>
                </div>
                `;

    document.getElementById("searchResults").innerHTML = output;
}

