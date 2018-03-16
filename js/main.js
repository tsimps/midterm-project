// creat transit and aerial basemap versions to be controlled with boxes
var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 16
});

// set up the map; make transit basemap the default
var map = L.map("map", {
  center: [39.97076858391126, -75.13526458991693],
  zoom: 12,
  layers: [Esri_WorldGrayCanvas]
});
map.zoomControl.setPosition("bottomleft");

var currentSlide = 0;
var jsonLink1 =
"https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_json_31318.geojson";
var stops;
var json;
$.getJSON(jsonLink1).done(function(data){ makeStopFeatureGroup(data); });
json = $.getJSON(jsonLink1);

var slide0 = {
  slideNumber: 0,
  title: function() {document.getElementById("sidebar-header").innerHTML = "Philadelphia Bus Ridership: A Visual Story";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "This project walks through a visualization of various bus ridership data. As you see on the map, Philadelphia has a lot of bus stops and a lot of bus riders (182 million annual unlinked trips). Data for this project is sourced from SEPTA, Automated Passenger Count (APC). These devices sample every run on every bus route each season. This uses data from each 2014-2017 Spring sampling. Data processing was completed in R with help from the beautiful DPLYR package.";},
  debug: function() {console.log('0');},
  visual: function(){
    stops.addTo(map)
    //clearStops();
    //clearMarkers();
    //$.getJSON(jsonLink1).done(function(data){ makeStops(data); });
  }
};

var slide1 = {
  slideNumber: 1,
  title: function() {document.getElementById("sidebar-header").innerHTML = "Major Bus Nodes";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 1";},
  debug: function() {console.log('0');},
  visual: function() {
    console.log('VISUAL');
    stops.addTo(map);
    stops.removeFrom(map);

    // pull json
    console.log(json.responseJSON);

    // once done, filter json
    filterFeatureGroup(json.responseJSON, 'field', 'value');

    // map the jawn
    //makeStops(filteredJson);

  },
};

var slide2 = {
  slideNumber: 2,
  title: function() {document.getElementById("sidebar-header").innerHTML = "Slide 2";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 2";},
  debug: function() {console.log('2');},
  visual: function() {

  }
};

var slide3 = {
  slideNumber: 3,
  debug: function() {console.log('3');},
  title: function() {document.getElementById("sidebar-header").innerHTML = "Slide 3";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 2";},
  visual: function() {}
};

var slide4 = {
  slideNumber: 4,
  debug: function() {console.log('4');},
  title: function() {document.getElementById("sidebar-header").innerHTML = "Slide 4";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 4";},
  visual: function() {}
};

var slide5 = {
  slideNumber: 5,
  debug: function() {console.log('5');},
  title: function() {document.getElementById("sidebar-header").innerHTML = "Slide 5";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 5";},
  visual: function() {}
};

var slideDeck = [slide0, slide1, slide2, slide3, slide4, slide5];

// go forward a slide
function advanceSlide() {
  // increment to next item in slide deck
  currentSlide += 1;
  //console.log('CURRENTSLIDE', currentSlide);

  slideDeck[currentSlide].title();
  slideDeck[currentSlide].body();
  slideDeck[currentSlide].visual();

  return slideDeck[currentSlide];
}

// go back a slide
function returnSlide() {
  // return to previous item in slide deck
  currentSlide -= 1;

  slideDeck[currentSlide].title();
  slideDeck[currentSlide].body();
  slideDeck[currentSlide].visual();

  return slideDeck[currentSlide];
}


// normalization the ridership to scale the markers
normalize = val => {
  var x;
  if(isNaN(val)) { x = 2;}
  else {
    if (val < 10) {
      x = 3;
    } else {
      x = Math.sqrt(val);
    }
    //if (val > 10) {x = Math.sqrt(val);}
  }
  return x;
};

/*
var parseData = function(res) {
  // Parse the JSON returned (res)
  var jsonFeatures = res.responseJSON.features;

  // Store our (now parsed) data to the global variable `data`
  data = _.chain(jsonFeatures)
  .map(function(datum) {

    var pathOpts = {
      //radius: allStops[i].Ridership * 1.75,
      radius: normalize(properties.avg_boards),
      fillColor: "#4CAF50",
      stroke: false,
      fillOpacity: 0.2
    };

    // Actually make the marker object a part of our data for later use.
    datum.marker = L.circleMarker([properties.Latitude, properties.Longitude], pathOpts);
    return datum;

  }).groupBy(function(datum) {

    // groupBy breaks the data up into groups (grouped by continent name here)
    return datum.ContinentName;

  }).mapObject(function(group) {

    // It is an object after the `groupBy` call (e.g. {group1: [grouped1, grouped2], group2: [grouped3]})
    var markerArray = _.map(group, function(datum) { return datum.marker; });
    var fitBoundsOptions = { padding: [15, 15] };  // An options object

    return {
      data: group,
      features: L.featureGroup(markerArray)
      .on('click', function() {  // Bind a function onto any click on this `featureGroup`
        map.fitBounds(this.getBounds(), fitBoundsOptions);
      })
    };
  }).value();

  // Add the featureGroups to our map
  _.each(data, function(datum) { datum.features.addTo(map); });
};
*/

/*
* This function filters our data and plots it

var filterAndPlot = function() {
  _.each(data, function(continent) {
    var markerArray = _.chain(continent.data)
    .filter(function(country) {
      var condition = true;
      if (stringFilter) {
        condition = condition && country.CountryName.toLowerCase().includes(stringFilter);
      }
      if (selectValue !== 'All') {
        condition = condition && country.ContinentName === selectValue;
      }
      return condition;
    })
    .map(function(country) { return country.marker; })
    .value();

    // clear the continent featureLayers
    continent.features.clearLayers();

    // Notice that our featureGroup was never removed from the map - all we have to do is add
    // markers to one of our featureGroups and it will immediately appear on the map
    _.each(markerArray, function(marker) { continent.features.addLayer(marker); });
  });
};
*/

// map the stop makers from a json file
function makeStopFeatureGroup(json) {
  console.log("JSON", json);

  // create layer group of station markers
  stops = L.featureGroup(
    _.map(json.features, function(feature) {

      var pathOpts = {
        //radius: allStops[i].Ridership * 1.75,
        radius: normalize(feature.properties.avg_boards),
        fillColor: "#4CAF50",
        stroke: false,
        fillOpacity: 0.2
      };

      return L.circleMarker([feature.properties.Latitude, feature.properties.Longitude], pathOpts).addTo(map);
    } // close _.map()
  )
);
}


// take in a json file and filter out based on values
function filterFeatureGroup(json, field, value) {
  var feat = 0;

  // filter field based on value
  _.each(json.features, function(features) {
    feat += 1;

    console.log(features.properties[field]); //how to refer to a value

  });
  console.log(feat);
  //return filteredJson;
}

function clearMarkers() {
  map.removeLayer(stops);
}

// bring in a kml file and add it to the map
function drawRoute(kml) {

}
