var bingApiKey = "AnKBT_bHZWYQ9X9Am43hr_EyNaxyCBhTtdofoHgmkd9TIr-VT6aPyLvXEaXrlBnX"
var weatherApiKey = "64013b468f23baa21fde4b13a3a2c029";

var coffeeShopsData = [];

var citySearch = document.getElementById("searchTbx");
var searchButton = document.getElementById("searchButton");
var searchHistory = document.getElementById("searchHistory");
var weatherEl = document.getElementById("weather");
var coffeeShopsEl = document.getElementById("coffeeShops");

var chainCafeList = ["starbucks", "dunkin donuts", "caribou coffee", "dunn bros coffee", "tully's coffee",
    "gloria jeans coffee", "mccafe", "lavazza", "peet's coffee"]

//-----------------------event listeners----------------------------------
searchButton.addEventListener("click", handleSearch);

searchHistory.addEventListener("click", function(event){
    var element = event.target;
    if(element.matches(".history")){
        var cityName = element.textContent;
        Search(cityName);
        handleCallingApis(cityName);
    }
})


//------------------------------------------------------------------------
refreshPage();
//This function when the page loads show the search history if exists
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
//This function adds a button for each searched city
function addSearchHistoryBtn(cityName) {
    searchHistory.setAttribute("style", "display: block;")
    var cityWordArray = cityName.split("%20");
    cityName = cityWordArray.join(" ");
    var cityBtn = document.createElement("button")
    cityBtn.setAttribute("class", "button is-info mt-2 is-fullwidth history")
    cityBtn.textContent = cityName
    searchHistory.appendChild(cityBtn)

}
//This function brings the history of search from local storage
function saveSearch(cityName) {
    var searchList = JSON.parse(localStorage.getItem("searchList"));
    var cityWordArray = cityName.split("%20");
    cityName = cityWordArray.join(" ");
    //if there is no history, an empty list is made and the item will be added to it
    if (!searchList) {
        searchList = [];
        searchList.push(cityName);
    }
    else {
        if (searchList.includes(cityName.trim())) {
            return;
        }
        // if the search history list length has less then 3 items, the item will be added to it 
        if (searchList.length < 3) {
            searchList.push(cityName);
        }
        else {
            /*if the search history list already has 3 items, the item in index 0 that is the oldest history 
            will be deleted, and the recent search will be added to the list*/
            
            searchList.shift();
            searchList.push(cityName);  
            console.log(cityName);
            //The oldest history button will be deleted    
            searchHistory.children[1].remove();
        }
    }
    addSearchHistoryBtn(cityName)
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
        cityName = arr.join("%20");
        cityWordArray[0] = cityName;
        cityName = cityWordArray.join(",");

        // Call saveSearch function here
        saveSearch(cityName);
        // Search(searchedCityValue);
        coffeeShopsData = [];
        //Call APIs
        handleCallingApis(cityName);
    }
    else {
        citySearch.value = "";
        // alert("A city name should be inserted!")
        // Added modal to alert user
        var searchAlertModal = document.getElementById('searchAlertModal');
        searchAlertModal.classList.add('is-active');
        searchAlertModal.querySelector('.modal-close').addEventListener('click', function() {
            searchAlertModal.classList.remove('is-active');
        })
    }
}
//----------------------------------- Handle calling APIs  ---------------------------------

function handleCallingApis(cityName) {
    var coordinates = [];
    var GeoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + weatherApiKey;
    //This fetch brings the response about Geographical coordinates
    fetch(GeoApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (geoData) {
                //If the city is not found, the length of data list will be empty
                if (geoData.length === 0) {
                    // alert("The searched city is not found!");
                    citySearch.value = "";
                    var searchedCityModal = document.getElementById('searchedCityModal');
                    searchedCityModal.classList.add('is-active');
                    searchedCityModal.querySelector('.modal-close').addEventListener('click', function() {
                        searchedCityModal.classList.remove('is-active');
                    })

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
                                var cityWordArray = cityName.split("%20");
                                var searchedCityValue = cityWordArray.join(" ");
                                var weatherCondition = {
                                    city: searchedCityValue,
                                    temp: tempFarenheit,
                                    icon: todayData.weather[0].icon
                                }
                                showWeatherSituation(weatherCondition)

                                var bingApiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=cafe&userLocation=" + coordinates[0] + "," + coordinates[1] + ",5000&key=" + bingApiKey;
                                //This fetch brings the coffee shops
                                fetch(bingApiUrl).then(function (response) {
                                    if (response.ok) {
                                        response.json().then(function (bingData) {
                                            var coffeeShopsEl = document.getElementById("coffeeShops");
                                            coffeeShopsEl.innerHTML = '';
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
                                                var cityWordArray = cityName.split("%20");
                                                cityName = cityWordArray.join(" ");
                                                Search(cityName)
                                            }
                                        });
                                    } else {
                                        // alert("There is a connection error!")
                                        var connectionError = document.getElementById('connectionError');
                                        connectionError.classList.add('is-active');
                                        connectionError.querySelector('modal-close').addEventListener('click', function() {
                                            connectionError.classList.remove('is-active');
                                        })
                                        
                                    }
                                });
                            });
                        } else {
                            // alert("There is a connection error!")
                            var connectionError = document.getElementById('connectionError');
                            connectionError.classList.add('is-active');
                            connectionError.querySelector('modal-close').addEventListener('click', function() {
                                connectionError.classList.remove('is-active');
                            })
                        }
                    });
                }
            });
        } else {
            // alert("There is a connection error!")
            var connectionError = document.getElementById('connectionError');
            connectionError.classList.add('is-active');
            connectionError.querySelector('modal-close').addEventListener('click', function() {
                connectionError.classList.remove('is-active');
            })
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
    coffeeShopsEl.setAttribute("style", "overflow-y:auto; border:solid;");
    var parentEl = document.createElement("div");
    parentEl.setAttribute("class", "row col-xs box row col-xs cafe");
    var coordinate = coffeeShop.coordinate[0] + "," + coffeeShop.coordinate[1];
    parentEl.setAttribute("data-coordinate", coordinate);

    var cafeInfo = document.createElement("div");
    cafeInfo.setAttribute("class", "box cafe-info");
    var coffeeImage = "<img src='./assets/images/coffeeIcon.gif' alt='Coffee Image' width='30' height='30'>  ";
    cafeInfo.innerHTML = coffeeImage + "<strong>" + coffeeShop.name + " : </strong> " + coffeeShop.address;
    parentEl.appendChild(cafeInfo);
    coffeeShopsEl.appendChild(parentEl);
}

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
                }
                map.entities.push(pins);
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
// Weather widget only visible when city entered in search bar or when city from previously searched list is clicked

