console.log("new one working");

document.getElementById("searchButton2").addEventListener("click", searchFunction2); 
const link2 = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey2 = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction2(){
    // Gets search box value and converts units to metric to be added to url
    let userInput2 = document.getElementById("searchInput2").value;   
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

    console.log(weatherData2);
}