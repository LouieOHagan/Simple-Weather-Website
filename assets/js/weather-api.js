// Event listeners to trigger searchFunction, after onclick or onkeyup events, searchFunction runs passing in two arguments 
// bind method and "this" as first parameter to function used as addEventListener expects a function reference rather than the function call 
document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/weather?q=", currentWeatherResults));
document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/forecast?q=", forecastResults));
const enterKeySearch = document.getElementById("searchInput");
enterKeySearch.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchFunction("https://api.openweathermap.org/data/2.5/weather?q=", currentWeatherResults);
        searchFunction("https://api.openweathermap.org/data/2.5/forecast?q=", forecastResults);
    }
});

/*  - searchFunction takes in two parameters, link & setFunction
    - Links go to same API however retrieve different data, one gets current weather (2.5/weather?) & one gets 5 day/3hr forecast (2.5/forecast?)
    - setfunction are callback functions (currentWeatherResults & forecastResults)
*/
function searchFunction(link, setFunction){
    //  url variable values constructs URL to be requested from Open Weather API
    //  userInput replaces all spaces with commas to ensure that url's are constructed correctly and no 404 errors occur if search has a space
    const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";
    let userInput = document.getElementById("searchInput").value;  
    userInput = userInput.replace(/\s/g,',');
    let units = "&units=metric";
    let url = link + userInput + units + apiKey;

    // If user attempts to search while input box is empty, onError function is called and passes in string of "emptyInput"
    if(!userInput){
        onError("emptyInput");
    }

    // Initializes request (request = xhr variable)
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    //  - Only checks if HTTP response status is 200 as onload only runs if readyState already has value of 4
    //  - If API request is successful, onSuccessfulSearch is called. setFunction is also called and passes in one argument, the response text from the API Request
    //  - If API HTTP response status is 404 and searched location is not found, onError function is called and passes in string of "404"
    xhr.onload = function() {
        if(this.status === 200){
            onSuccessfulSearch();
            setFunction(xhr.responseText);
        } else if (this.status === 404){
            onError("404");
        }
    };

    // Sends request to server
    xhr.send();                             
}

/*  - onSuccessfulSearch takes in no parameters and is only called when API request is successful
    - After successful search, function automatically scrolls to #currentResults div
    - Function also ensures any error text and styles that were previously there from failed search are removed
*/
function onSuccessfulSearch(){
    document.getElementById('currentResults').scrollIntoView({behavior: "smooth"});
    document.getElementById("ifError").innerHTML = '';
    document.getElementById("searchInput").classList.remove("ifErrorBorder");
}

/*  - onError function takes in one parameter, errorType
    - if statement determines what text is outputted to ifError div by what argument was passed in when the function was called in the searchFunction
    - Function also ensures page is reset to the way it was when user first loads the page and adds class to searchInput text field for red border
*/
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
    document.getElementById("carouselTarget").innerHTML = '';
}

/*  - currentWeatherResults function takes in one parameter, weatherData
    - weatherData is the response text from the API Request for the current weather in the searched location
    - Data is parseed in to JSON format
*/
function currentWeatherResults(weatherData) {
    weatherData = JSON.parse(weatherData); 
    
    let output = "";
    output += `
        <div class="row">
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
                        <h2><img src="./assets/images/sun-rise-time.png" alt="Wind"> ${sunTimes(weatherData.sys.sunrise, weatherData.timezone)}</h2>
                    </div>
                    <!-- Sun Set Icon and Time-->
                    <div class="col col-5">
                        <h2><img src="./assets/images/sun-set-time.png" alt="Wind"> ${sunTimes(weatherData.sys.sunset, weatherData.timezone)}</h2>
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

    // #currentResults targetted. Class of main-section added to div and output variable value outputted to div
    document.getElementById("currentResults").classList.add("main-section");
    document.getElementById("currentResults").innerHTML = output;
}

/*  - forecastResults function takes in one parameter, forecastData
    - forecastData is the response text from the API Request for the forecast for the next 5 days with 3 hour intervals in the searched location
    - Data is parseed in to JSON format
*/
function forecastResults(forecastData) {
    forecastData = JSON.parse(forecastData);
    
    let forecastOutput = '';
    let i;
    forecastOutput += `
                    <div class="forecast-carousel">
                        <!-- Carousel Arrows -->
                        <i class="fas fa-chevron-left prev"></i>
                        <i class="fas fa-chevron-right next"></i>
                        <!-- / .Carousel Arrows -->

                        <div class="row">
                            <!-- Carousel - Div ID is targetted and then values are inserted to classes of carousel cards -->
                            <div id="myDIV" class="col-10 col-sm-11 col-md-8 carousel-wrapper">
                    `;
    
    // Loops through JSON Object and creates a card with the class forecast-item within the #myDIV div for every iteration (40 overall - 3hr intervals, 8 cards a day * 5 days)
    for(i = 0; i < forecastData.list.length; i++) {
        forecastOutput += `
                        <div class="forecast-item">
                            <h3 class="cardTime">${forecastCarouselDay(forecastData.list[i].dt, forecastData.city.timezone)}</h3>
                            <div class="cardImg"><img src="./assets/images/forecast-icons/${forecastData.list[i].weather[0].icon}.png" alt="Wind"></div>
                            <h4 class="cardTemp">${Math.round(forecastData.list[i].main.temp)}&#8451;</h4>
                            <h5 class="cardWeather">${forecastData.list[i].weather[0].main}</h5>
                            <p class="cardRain"><img src="./assets/images/precipitation.png" alt="Rain">${ifRaining(forecastData.list[i].rain)}mm</p>
                            <p class="cardHumidity"><img src="./assets/images/humidity.png" alt="Humidity">${forecastData.list[i].main.humidity}&#37;</p>
                            <p class="cardWind"><img src="./assets/images/wind-speed.png" alt="Wind Speed">${msToKMH(forecastData.list[i].wind.speed)} km/h</p>
                        </div>
                        `;
    }

    forecastOutput += `
                    </div>
                    <!-- / .Carousel -->
                </div>
            </div>
            `;
    
    // #carouselTarget targetted. Class of carousel added to div and forecastOutput variable value outputted to div
    // sliderInit function called from carousel.js file to reinitialise Slick JS function to ensure carousel functionality works when JS adds HTML to page.
    document.getElementById("carouselTarget").classList.add("carousel");
    document.getElementById("carouselTarget").innerHTML = forecastOutput;
    sliderInit();
}

/*  - forecastCarouselDay function takes in two parameters, timestamp & timezone
    - forecastDay variable adds timestamp and timezone unix values together, mulitplies by 1000 to convert to miliseconds and creates new date timestamp
    - Timestamp is then converted to a string & split. Slice method used to remove the last colon and seconds amount from dayTime value. 
    - Returns "Day of Week & Time" for carousel cards
*/
function forecastCarouselDay(timestamp, timezone){
    let forecastDay = new Date((timestamp + timezone) * 1000);
    let newTimestamp = forecastDay.toString().split(' ');
    let day = newTimestamp[0];
    let dayTime = newTimestamp[4].slice(0, 5);

    return `${day} ${dayTime}`;
} 

/*  - msToKMH function takes in one parameters, wind
    - msToKMHCalculation variable converts wind speed from m/s to km/h (* 3.6) & limits result to 1 decimal place
*/
function msToKMH(wind) {
    let msToKMHCalculation = (wind * 3.6).toFixed(1);
    return msToKMHCalculation;
}

/*  - sunTimes function takes in two parameters, sunTimeValue & timezoneValue
    - sunTime variable adds sunTimeValue and timezoneValue unix values together, mulitplies by 1000 to convert to miliseconds and creates new date timestamp
    - Timestamp is then converted to a string & split. Slice method used to remove the last colon and seconds amount from dayTime value. 
    - Returns "Sun Rise/Set Time" for current weather card
*/
function sunTimes(sunTimeValue, timezoneValue) {
    let sunTime = new Date((sunTimeValue + timezoneValue) * 1000);
    let sunTimeToString = sunTime.toString().split(' ');
    let sunTimeStringSliced = sunTimeToString[4].slice(0,5);
    return sunTimeStringSliced;
}

/*  - ifRaining function takes in one parameters, rain
    - Checks if rain parameter is defined as API only displays calculated data (not raining = no rain parameter in API Response)
*/
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