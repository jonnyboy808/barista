var bingApiKey = "AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX"
var weatherApiKey = "64013b468f23baa21fde4b13a3a2c029";

var coffeeShopsData = [];

var citySearch = document.getElementById("searchTbx");
var searchButton = document.getElementById("searchButton");
var searchHistory = document.getElementById("searchHistory");

//https://dev.virtualearth.net/REST/v1/LocalSearch/?query=cafe&userLocation=48.604311,-122.981998,5000&output=json&key=AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX

searchButton.addEventListener("click", handleSearch);

/*var coffeeShopsEl = document.getElementById("coffeeShops");
coffeeShopsEl.setAttribute("style", "none");*/

// function to make the previous search buttons addPreviousHistory


// Refresh page function
//  Get item from storage
refreshPage();

function refreshPage() { 
    var searchList = JSON.parse(localStorage.getItem("searchList"));
    if (!searchList) {
        searchHistory.setAttribute("style", "display: none;")
        
    } else {
        searchHistory.setAttribute("style", "display: block;")
        for (var i = 0; i < searchList.length; i++) {
            addSearchHistoryBtn(searchList[i])
        }

    }
}

function addSearchHistoryBtn(cityName) {
    var cityBtn = document.createElement("button")
    cityBtn.setAttribute("data-name", cityName)
    cityBtn.setAttribute("class", "button is-info mt-2 is-fullwidth history")
    cityBtn.textContent = cityName
    searchHistory.appendChild(cityBtn)

}

// call addPreviousHistory function here
// function saveSearch()
function saveSearch(cityName) {
    // var searchList = get item from local storage
    var searchList = JSON.parse(localStorage.getItem("searchList"));
    var cityWordArray = cityName.split("%20");
    cityName = cityWordArray.join(" ");
    // if falsy then 
    if (!searchList) {
        // searchList = [];
        searchList = [];
        searchList.push(cityName);
        // addPreviousHistory() call function here
        console.log(searchList);
        // addPreviousHistory(searchList);
    }
    //     if length < 3
   else { 
       if (searchList.includes(cityName)) {
        return

       }
       
       console.log(searchList);
        if (searchList.length < 3) {
            // push the city name to this array
            searchList.push(cityName);
        }
        // remove first item in index 0 from list
        //  else length is more than 3
        else {
            searchList.shift();

            // push cityName to the list 
            searchList.push(cityName);

            // you have to remove the button of item in index 0
            // removeButton(0);
        }
        // save list in local storage
        
        // addPreviousHistory() function call here
        // addPreviousHistory(searchList);
    }
    
    
    localStorage.setItem("searchList", JSON.stringify(searchList));
}


function handleSearch() {
    var searchedCityValue = citySearch.value.trim();
    var cityWordArray = searchedCityValue.split(",");
    var cityName = cityWordArray[0];
    if (cityName) {
        var arr = cityName.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        cityName = arr.join(" ");
        cityWordArray[0] = cityName;
        cityName = cityWordArray.join(",");

        // Call saveSearch function here
        saveSearch(cityName);
        // Search(searchedCityValue);
        addSearchHistoryBtn(cityName);
        coffeeShopsData = [];
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
                                    temp: tempFarenheit + "ºF",
                                    icon: todayData.weather[0].icon
                                }
                                showWeatherSituation(weatherCondition)

                                var bingApiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=cafe&userLocation=" + coordinates[0] + "," + coordinates[1] + ",5000&key=" + bingApiKey;
                                //This fetch brings the coffee shops
                                fetch(bingApiUrl).then(function (response) {
                                    if (response.ok) {
                                        response.json().then(function (bingData) {
                                            var cafeData = bingData.resourceSets[0].resources;
                                            console.log(cafeData);
                                            for (var i = 0; i < cafeData.length; i++) {
                                                var coffeeShop = {
                                                    name: cafeData[i].name,
                                                    coordinate: cafeData[i].point.coordinates,
                                                    address: cafeData[i].Address.formattedAddress
                                                }
                                                coffeeShopsData.push(coffeeShop);
                                                showcoffeeShop(coffeeShop);
                                                Search(cityName)
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
    coffeeShopsEl.setAttribute("style", "overflow-y:auto; border:solid;");
    var parentEl = document.createElement("div");
    parentEl.setAttribute("class", "row col-xs box row col-xs cafe");
    var coordinate = coffeeShop.coordinate[0] + "," + coffeeShop.coordinate[1];
    parentEl.setAttribute("data-coordinate", coordinate);

    var cafeInfo = document.createElement("div");
    cafeInfo.setAttribute("class", "box cafe-info");
    var coffeeImage = "<img src='./assets/images/coffeeIcon.gif' alt='Coffee Image' width='30' height='30'>  ";
    console.log(coffeeImage)
    cafeInfo.innerHTML = coffeeImage + "<strong>" + coffeeShop.name + " : </strong> " + coffeeShop.address;
    parentEl.appendChild(cafeInfo);
    coffeeShopsEl.appendChild(parentEl);
}
//Bahareh

var map, searchManager;
var pins, locs = [];
function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: bingApiKey,
    });
}

function Search(cityName) {
    if (!searchManager) {
        //Create an instance of the search manager and perform the search.
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            searchManager = new Microsoft.Maps.Search.SearchManager(map);
            Search(cityName)
        });
    } else {
        //Remove any previous results from the map.
        map.entities.clear();

        //Get the users query and geocode it.
        var query = cityName;
        pins = [];
        locs = [];
        geocodeQuery(query);
    }
}

function test() {
    
}

function geocodeQuery(query) {
    var searchRequest = {
        where: query,
        callback: function (r) {
            if (r && r.results && r.results.length > 0) {
                var pin, output = 'Results:<br/>';

                var location = new Microsoft.Maps.Location(coffeeShopsData[1].coordinate[0], coffeeShopsData[1].coordinate[1]);
                
                for (var i = 0; i < coffeeShopsData.length; i++) {
                    //Create a pushpin for each result. 
                    var location = new Microsoft.Maps.Location(coffeeShopsData[i].coordinate[0], coffeeShopsData[i].coordinate[1]);
                    console.log(location);

                    pin = new Microsoft.Maps.Pushpin(location, {
                        title: coffeeShopsData[i].name,
                        text: i + ''
                    });

                    pins.push(pin);
                    locs.push(location);

                    // output += i + ') ' + r.results[i].name + '<br/>';
                }

            //    for (var i = 0; i < r.results.length; i++) {
            //         //Create a pushpin for each result. 
            //         pin = new Microsoft.Maps.Pushpin(r.results[i].location, {
            //             text: i + ''
            //         });
            //         pins.push(pin);
            //         locs.push(r.results[i].location);

            //         // output += i + ') ' + r.results[i].name + '<br/>';
            //     }
                // console.log(pins);

                //Add the pins to the map
                map.entities.push(pins);
                // Microsoft.Maps.Events.addHandler(pin, 'mouseover', function (e) {
                //     e.target.setOptions({ color: 'red' });
                // });

                //Display list of results
                // document.getElementById('output').innerHTML = output;

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

