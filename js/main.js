// creat transit and aerial basemap versions to be controlled with boxes
var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var MapBoxStyle = L.tileLayer('https://api.mapbox.com/styles/v1/tandrewsimpson/cjeujps1g0kjw2rpns6kgmcv4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw', {
  maxZoom: 20,
  minZoom: 16,
  opacity: 0.75
});

var center = [39.97076858391126, -75.13526458991693];

// set up the map; make transit basemap the default
var map = L.map("map", {
  center: [39.97076858391126, -75.13526458991693],
  zoom: 12,
  layers: [CartoDB_Positron]
});
map.zoomControl.setPosition("topleft");

var baseLayers = {
  "Mapbox Aerial": MapBoxStyle,
  "CartoDB Light": CartoDB_Positron
};
L.control.layers(baseLayers).addTo(map);


var currentSlide = 0;
var jsonLink1 =
"https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_json_31318.geojson";
var markers;
var shape;
var data;
//$.getJSON(jsonLink1).done(function(data){ makeMarkersJSON(data); });
//json = $.getJSON(jsonLink1);

var getData = function() {
  return $.getJSON(jsonLink1).then( function(json){
    console.log(json);
    return json.features;
  });
  //return data;
};

var slide0 = {
  slideNumber: 0,
  title: function() {document.getElementById("sidebar-header").innerHTML = "Philadelphia Bus Ridership: A Visual Story";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "This project walks through a visualization of various bus ridership data. As you see on the map, Philadelphia has a lot of bus stops and a lot of bus riders (182 million annual unlinked trips). Data for this project is sourced from SEPTA, Automated Passenger Count (APC). These devices sample every run on every bus route each season. This uses data from each 2014-2017 Spring sampling. Data processing was completed in R with help from the beautiful DPLYR package.";},
  debug: function() {console.log('0');},
  visual: function(){
    clearMarkers();
    clearShapes();
    resetMap();
    makeMarkers(data).addTo(map);
  }
};

var slide1 = {
  slideNumber: 1,
  title: function() {document.getElementById("sidebar-header").innerHTML = "Major Bus Nodes";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 1";},
  debug: function() {console.log('0');},
  visual: function() {
    clearMarkers();
    clearShapes();
    resetMap();
    //map.addLayer(baseLayers[1]);
    feats = filterFeatureGroup(data, 'avg_boards', 200);
    makeMarkers(feats).addTo(map);
  },
};

var slide2 = {
  slideNumber: 2,
  title: function() {document.getElementById("sidebar-header").innerHTML = "A Closer Look: Broad & Olney";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 3";},
  debug: function() {console.log('2');},
  visual: function() {
    clearMarkers();
    clearShapes();
    map.setView([40.038833582357064, -75.14461964710792], 18);
    switchToAerial();
    makeMarkers(data, 0.75)
    .addTo(map);
  }
};

var slide3 = {
  slideNumber: 3,
  debug: function() {console.log('3');},
  title: function() {document.getElementById("sidebar-header").innerHTML = "Examining the Route 47";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "This shows...";},
  visual: function() {
    clearMarkers();
    clearShapes();
    makeShape(47).addTo(map);
    feats = filterFeatureGroup(data, "routeNumbers", 47);
    makeMarkers(feats, 0.75).addTo(map);
    switchToLite();
    map.fitBounds(markers.getBounds());
  }
};

var slide4 = {
  slideNumber: 4,
  debug: function() {console.log('4');},
  title: function() {document.getElementById("sidebar-header").innerHTML = "Slide 4";},
  body: function() {document.getElementById("sidebar-text").innerHTML = "Slide 4";},
  visual: function() {
    clearMarkers();
    clearShapes();  }
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

// map the stop makers from a json file
function makeMarkers(dat, opacity = 0.2) {
  //console.log("JSON", json);

  // create layer group of station markers
  markers = L.featureGroup(
    _.map(dat, function(feature) {
      //console.log(feature.properties.avg_boards);
      var pathOpts = {
        //radius: allStops[i].Ridership * 1.75,
        radius: normalize(feature.properties.avg_boards),
        fillColor: "#4CAF50",
        stroke: false,
        fillOpacity: opacity
      };

      return L.circleMarker([feature.properties.Latitude, feature.properties.Longitude], pathOpts)
      .bindPopup(
        "<b> Stop ID: </b>" +
        feature.properties.Stopid +
        "<br><b>Stop Name: </b>" +
        feature.properties.Stop_Name +
        "<br><b>Spring '14-'17 Average Boardings Per Day: </b>" +
        Math.round(feature.properties.avg_boards) +
        "<br><b>Direction: </b>" +
        feature.properties.Direction +
        "<br><b>Routes that Stop Here: </b>" +
        feature.properties.routeNumbers
      );
    } // close _.map()
  ));
  return markers;
}

// take in a json file and filter out based on values
function filterFeatureGroup(data, field, value) {
  var filteredData = [];

  // filter field based on value
  _.each(this.data, function(features) {
    //feat += 1;
    if (field == "routeNumbers") {
      //console.log('filter by route');
      var str = features.properties[field];
      if (str.includes(value)) {filteredData.push(features);}
    }
    else {
      if(features.properties[field] > value) {
        filteredData.push(features);
      }
      //console.log(features.properties[field]); //how to refer to a value
    }


  });
  //console.log(filteredData);

  return filteredData;
}

function clearMarkers() { if(markers != null) {markers.removeFrom(map);} }
function clearShapes() { if(shape != null) {shape.removeFrom(map);} }


function resetMap() {
  map.addLayer(CartoDB_Positron);
  map.setView([39.97076858391126, -75.13526458991693], 12);
}

function switchToAerial() {
  map.addLayer(MapBoxStyle);
  map.removeLayer(CartoDB_Positron);

}

function switchToLite() {
  map.addLayer(CartoDB_Positron);
  map.removeLayer(MapBoxStyle);

}
//shape.getLayers()[0].feature.geometry.geometries.pop()
function filterShapes(shape) {
  //this.shape.getLayers()[0].feature.geometry.geometries.pop();
  //return shape;

  feature = this.shape.getLayers()[0].feature;
  //console.log('FEATURE ', feature);


  for (var i = 0; i < feature.geometry.geometries.length; i++) {
    console.log('a');
    console.log(feature.geometry.geometries[i].type);
    feature.geometry.geometries.type !== 'Point';
  }

}

// bring in a kml file, conver to L.geojson
function makeShape(route) {
  shape = omnivore.kml('https://raw.githubusercontent.com/tsimps/midterm-project/master/KMLs/'+route+'.kml');
  //newShape = filterShapes(shape);
  return shape;
}

$(document).ready(function() {
  //slide0.visual();
  $.getJSON(jsonLink1).done( function(json){
    //console.log(json);
    data = json.features;
    slide0.visual();
  });
});

/*
map.on('zoomend', function() {
    var currentZoom = map.getZoom();
    console.log('CURRENTZOOM', currentZoom);

    if (currentZoom > 15) {
      console.log(markers.getLayers()[0].options.radius);

      markers.setStyle(
        { radius: 10 }
      );
      //markers.setSyle({
        //radius: markers.eachLayer(function(layer){return layer.options.radius;})
      //});

    } else {

    }});
*/
