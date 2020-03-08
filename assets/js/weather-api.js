document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/weather?q=", currentWeatherResults));
document.getElementById("searchButton").addEventListener("click", searchFunction.bind(this, "https://api.openweathermap.org/data/2.5/forecast?q=", forecastResults));
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction(link, setFunction){
    // Gets search box value and converts units to metric to be added to url
    let userInput = document.getElementById("searchInput").value + "&units=metric";   
    // Removes spaces from search box value and replaces with comma so link doesnt return 404.  
    userInput = userInput.replace(/\s/g,',');

    let url = link + userInput + apiKey;    // adds endpoint, API Key and UserInput together to form link to be called

    console.log("Search function called");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);             // Initializes request (request = xhr variable)
    
    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            console.log("1234");
            setFunction(xhr.responseText);
        } else if (this.status === 404 || this.status === 400){
            document.getElementById("ifError").innerHTML = `
                                                            <p style="font-size: 0.95rem;"><span style="color:red;">Error: Location Not Found</span> <br>
                                                            Please ensure there is a comma inbetween any spaces you may have. <br>
                                                            Think this is a mistake ? Let Us Know <a href="#" target="_blank">Here</a>!</p>
                                                            `;
        }
    };
    
    xhr.send();                             // Sends request to server
}

function currentWeatherResults(weatherData) {
    weatherData = JSON.parse(weatherData);
    console.log("Current Weather results function called");
    console.log(weatherData);
    let output = "";

    output += `<p>${weatherData.wind.speed}</p>`;

    document.getElementById("currentResult").innerHTML = output;
}

function forecastResults(forecastData) {
    forecastData = JSON.parse(forecastData);
    console.log("5 day forecast results function called");
    console.log(forecastData);

    let output2 = "";
    let i;
    output2 += `
                <div class="weatherForecast">
                    <h1>${forecastData.city.name}</h1>
                `;

    for (i = 0; i < forecastData.list.length; i++  ) {

        output2 += ` 
                        <p>Day ${[i]}</p>
                        <ul>
                            <li>Time: ${forecastData.list[i].dt_txt}</li>
                            <li>Weather: ${forecastData.list[i].weather[0].main}</li>
                            <li>Temperature: ${Math.round(forecastData.list[i].main.temp)}&#8451;</li>
                            <li>Humidity: ${forecastData.list[i].main.humidity}&#37;</li>
                        </ul>
                    </div>`;
    }

    document.getElementById("forecastResult").innerHTML = output2;
}