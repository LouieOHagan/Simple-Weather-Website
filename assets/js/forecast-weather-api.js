console.log("new one working");

document.getElementById("searchButton2").addEventListener("click", searchFunction2); 
const link2 = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey2 = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction2(){
    // Gets search box value and converts units to metric to be added to url
    let userInput2 = document.getElementById("searchInput2").value + "&units=metric";   
    // Removes spaces from search box value and replaces with comma so link doesnt return 404.  
    userInput2 = userInput2.replace(/\s/g,',');

    let url2 = link2 + userInput2 + apiKey2;    // adds endpoint, API Key and UserInput together to form link to be called

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url2, true);             // Initializes request (request = xhr variable)
    
    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            resultsFunction2(xhr.responseText);
        } else if (this.status === 404){
            document.getElementById("ifError2").innerHTML = `
                                                            <p style="font-size: 0.95rem;"><span style="color:red;">Error: Location Not Found</span> <br>
                                                            Please ensure there is a comma inbetween any spaces you may have. <br>
                                                            Think this is a mistake ? Let Us Know <a href="#" target="_blank">Here</a>!</p>
                                                            `;
        }
    };
    
    xhr.send();                             // Sends request to server
}

function resultsFunction2(weatherData2) {
    weatherData2 = JSON.parse(weatherData2);

    let output2 = "";
    let i;
    output2 += `
                <div class="weatherForecast">
                    <h1>${weatherData2.city.name}</h1>
                `;

    for (i = 0; i < weatherData2.list.length; i++  ) {

        output2 += ` 
                        <p>Day ${[i]}</p>
                        <ul>
                            <li>Time: ${weatherData2.list[i].dt_txt}</li>
                            <li>Weather: ${weatherData2.list[i].weather[0].main}</li>
                            <li>Rain: ${ifRaining(weatherData2.list[i].rain)}</li>
                            <li>Temperature: ${Math.round(weatherData2.list[i].main.temp)}&#8451;</li>
                            <li>Humidity: ${weatherData2.list[i].main.humidity}&#37;</li>
                            <li>Wind Speed: ${msToKMH(weatherData2.list[i].wind.speed)} km/h</li>
                        </ul>
                    </div>`;
    }

    document.getElementById("searchResults2").innerHTML = output2;
}

// Converts wind speed from m/s to km/h (* 3.6) & limits result to 1 decimal place.
function msToKMH(wind) {
    return  (wind * 3.6).toFixed(1);
}

function ifRaining(rain){
    if(rain !== undefined){
        if(rain["1h"] !== undefined) {
            console.log("Rain 1h");
            return rain["1h"] + "mm"; 
        } 
        
        if (rain["3h"] !== undefined) {
            console.log("Rain 3h");
            return rain["3h"] + "mm"; 
        }
    } else{
        console.log("no rain");
        return "0 mm";
    }
}