document.getElementById("searchButton").addEventListener("click", searchFunction); 
const link = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction(){
    let userInput = document.getElementById("searchInput").value + "&units=metric";
    console.log(userInput);
    let url = link + userInput + apiKey;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    
    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            resultsFunction(xhr.responseText);
        }
    };

    xhr.send();
}

function resultsFunction(weatherData) {
    console.log(weatherData);
}