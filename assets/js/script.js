var googleapiKey = "AIzaSyBxttPCiINqjGfmC3mQcs-MznhmsLTwjyQ"

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
// Weather widget only visible when city entered in search bar or when city from previously searched list is clicked
    
    
    
    
    
    // Jonathan
    function loadMapScenario() {
        var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
            center: new Microsoft.Maps.Location(37.7749, -122.4194),
            zoom: 13
        });

        var searchManager = new Microsoft.Maps.Search.SearchManager(map);

        Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
            searchManager.reverseGeocode({
                location: e.location,
                callback: function (result) {
                    if (result && result.address) {
                        var searchRequest = {
                            query: 'coffee',
                            location: e.location,
                            radius: 500,
                            callback: function (searchResponse, searchRequest) {
                                if (searchResponse && searchResponse.results) {
                                    var coffeeLayer = new Microsoft.Maps.Layer();
                                    for (var i = 0; i < searchResponse.results.length; i++) {
                                        var coffeePushpin = new Microsoft.Maps.Pushpin(searchResponse.results[i].location, { title: searchResponse.results[i].name });
                                        coffeeLayer.add(coffeePushpin);
                                    }
                                    map.layers.insert(coffeeLayer);
                                } else {
                                    alert('No coffee shops found');
                                }
                            },
                            errorCallback: function (searchRequest) {
                                alert('Error searching for coffee shops');
                            }
                        };
                        searchManager.search(searchRequest);
                    }
                }
            });
        });
    }
    // Jonathan
