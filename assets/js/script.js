var bingApiKey = "AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX"
var weatherApiKey = "64013b468f23baa21fde4b13a3a2c029";

var citySearch = document.getElementById("searchTbx");
var searchButton = document.getElementById("searchButton");

//https://dev.virtualearth.net/REST/v1/LocalSearch/?query=cafe&userLocation=48.604311,-122.981998,5000&output=json&key=AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX

searchButton.addEventListener("click", handleSearch);

function handleSearch() {
    var searchedCityValue = citySearch.value.trim();
    var cityWordArray = searchedCityValue.split(",");
    var cityName = cityWordArray[0];
    if (cityName) {
        var arr = cityName.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        cityName = arr.join("%20");
        cityWordArray[0] = cityName;
        cityName = cityWordArray.join(",");
        console.log(cityName)
        //Call APIs
        handleCallingApis(cityName);
    }
    else {
        citySearch.value = "";
        alert("A city name should be inserted!")
    }
}
//Bahareh
//----------------------------------- Handle calling APIs  ---------------------------------
function handleCallingApis(cityName) {
    var coordinates = [];
    var GeoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + weatherApiKey;
    console.log(GeoApiUrl)
    //This fetch brings the response about Geographical coordinates
    fetch(GeoApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (geoData) {
                //If the city is not found, the length of data list will be empty
                if (geoData.length === 0) {
                    alert("The searched city is not found!");
                    citySearch.value = "";
                }
                else {
                    //If city is found, its longitude and lattitude will be retrieved and sent to the weather API
                    coordinates.push(geoData[0].lat);
                    coordinates.push(geoData[0].lon);
                    //call the map api to show the curent city
                    // loadMapScenario();
                    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&appid=" + weatherApiKey;
                    //This fetch brings the response about today's weather
                    fetch(weatherApiUrl).then(function (response) {
                        if (response.ok) {
                            response.json().then(function (todayData) {
                                var tempFarenheit = parseFloat(((todayData.main.temp - 273) * 1.8) + 32).toFixed(2);
                                var weatherCondition = {
                                    city: cityName,
                                    temp: tempFarenheit,
                                    icon: todayData.weather[0].icon
                                }
                                showWeatherSituation(weatherCondition)

                                var bingApiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=cafe&userLocation=" + coordinates[0] + "," + coordinates[1] + ",5000&key=" + bingApiKey;
                                //This fetch brings the coffee shops
                                fetch(bingApiUrl).then(function (response) {
                                    if (response.ok) {
                                        response.json().then(function (bingData) {
                                            var cafeData = bingData.resourceSets[0].resources;
                                            for (var i = 0; i < cafeData.length; i++) {
                                                var coffeeShop = {
                                                    name: cafeData[i].name,
                                                    coordinate: cafeData[i].point.coordinates,
                                                    address: cafeData[i].Address.formattedAddress
                                                }
                                                showcoffeeShop(coffeeShop);
                                            }
                                        });
                                    } else {
                                        alert("There is a connection error!")
                                    }
                                });
                            });
                        } else {
                            alert("There is a connection error!")
                        }
                    });
                }
            });
        } else {
            alert("There is a connection error!")
        }
    });
};

//This function shows the weather condition for current day
function showWeatherSituation(weatherObj) {
    var weatherEl = document.getElementById("weather");
    var cityEl = document.getElementById("city");
    var temperatureEl = document.getElementById("temperature");
    cityEl.textContent = weatherObj.city;
    temperatureEl.textContent = "temperatue: " + weatherObj.temp;
    var iconImage = document.createElement("img");
    iconImage.setAttribute("id", "today-weather")
    iconImage.setAttribute("src", "https://openweathermap.org/img/w/" + weatherObj.icon + ".png");
    iconImage.setAttribute("alt", "Weather icon")
    temperatureEl.append(iconImage)
}
//This function adds the name and addresses of coffee shops to the page
function showcoffeeShop(coffeeShop) {
    console.log(coffeeShop)
    var coffeeShopsEl = document.getElementById("coffeeShops");
    var parentEl = document.createElement("div");
    parentEl.setAttribute("class", "cafe");
    var coordinate = coffeeShop.coordinate[0] + "," + coffeeShop.coordinate[1];
    console.log(coordinate)
    parentEl.setAttribute("data-coordinate", coordinate);
    var cafeName = document.createElement("li");
    cafeName.setAttribute("class", "title is-6 cafe-name");
    cafeName.textContent = coffeeShop.name;
    var cafeAddress = document.createElement("p");
    cafeAddress.setAttribute("class", "cafe-address");
    cafeAddress.textContent = coffeeShop.address;
    parentEl.appendChild(cafeName);
    parentEl.appendChild(cafeAddress);
    coffeeShopsEl.appendChild(parentEl);
}
//Bahareh

var map, searchManager;
function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: bingApiKey,
    });
}

function Search() {
    if (!searchManager) {
        //Create an instance of the search manager and perform the search.
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            searchManager = new Microsoft.Maps.Search.SearchManager(map);
            Search()
        });
    } else {
        //Remove any previous results from the map.
        map.entities.clear();

        //Get the users query and geocode it.
        var query = document.getElementById('searchTbx').value;
        geocodeQuery(query);
    }
}

function geocodeQuery(query) {
    var searchRequest = {
        where: query,
        callback: function (r) {
            if (r && r.results && r.results.length > 0) {
                var pin, pins = [], locs = [], output = 'Results:<br/>';

                for (var i = 0; i < r.results.length; i++) {
                    //Create a pushpin for each result. 
                    pin = new Microsoft.Maps.Pushpin(r.results[i].location, {
                        text: i + ''
                    });
                    pins.push(pin);
                    locs.push(r.results[i].location);

                    output += i + ') ' + r.results[i].name + '<br/>';
                }

                //Add the pins to the map
                map.entities.push(pins);

                //Display list of results
                document.getElementById('output').innerHTML = output;

                //Determine a bounding box to best view the results.
                var bounds;

                if (r.results.length == 1) {
                    bounds = r.results[0].bestView;
                } else {
                    //Use the locations from the results to calculate a bounding box.
                    bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                }

                map.setView({ bounds: bounds });
            }
        },
        errorCallback: function (e) {
            //If there is an error, alert the user about it.
        //    alert("No results found.");
        }
    };

    //Make the geocode request.
    searchManager.geocode(searchRequest);
}



//Bahareh
//This function shows the weather condition for current day
function showWeatherSituation(weatherObj) {
    var cityEl = document.getElementById("city");
    var temperatureEl = document.getElementById("temperature");
    cityEl.textContent = weatherObj.city;
    temperatureEl.textContent = "temperatue: " + weatherObj.temp;
    var iconImage = document.createElement("img");
    iconImage.setAttribute("id", "today-weather")
    iconImage.setAttribute("src", "https://openweathermap.org/img/w/" + weatherObj.icon + ".png");
    iconImage.setAttribute("alt", "Weather icon")
    temperatureEl.append(iconImage)
}
//Bahareh
// Weather widget only visible when city entered in search bar or when city from previously searched list is clicked

