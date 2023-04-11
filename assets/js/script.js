
    
    
    
    

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
                                 