console.log("Test");

document.getElementById("searchButton").addEventListener("click", searchFunction);
const link = "https://api.openweathermap.org/data/2.5/weather?q=london";
const apiKey = "&appid=308bcfc339b942ce47cc8a976f8c4728";

function searchFunction(){
    console.log("Button works!")
    let url = link + apiKey;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    
    xhr.onload = function() {
        if(this.readyState === 4 && this.status === 200){
            console.log("I'm ready!");
            console.log(xhr.responseText)
        }
    };

    xhr.send();
}