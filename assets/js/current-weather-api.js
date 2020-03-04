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

    document.getElementById("searchResults").innerHTML = `Weather: ${weatherData.weather[0].main}`;
}