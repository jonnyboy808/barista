
var bingApiKey = "AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX"
var weatherApiKey = "64013b468f23baa21fde4b13a3a2c029";

var citySearch = document.getElementById("city-search");
var searchButton = document.getElementById("search-button");

//https://dev.virtualearth.net/REST/v1/LocalSearch/?query=cafe&userLocation=48.604311,-122.981998,5000&output=json&key=AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX

searchButton.addEventListener("click", handleSearch);

function handleSearch(){
    var searchedCityValue = citySearch.value().trim();
    var cityWordArray = searchedCityValue.split(",");
    var cityName = cityWordArray[0];
    if (cityName) {
        var arr = cityName.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        cityName = arr.join(" ");
        //Call APIs
        handleCallingApis();
    }
    else {
        alert("A city name should be inserted!")
    }
}

function handleCallingApis(){
    
}