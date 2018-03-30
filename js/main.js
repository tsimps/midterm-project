// creat transit and aerial basemap versions to be controlled with boxes
var CartoDB_Positron = L.tileLayer(
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  {
    attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: "abcd",
    maxZoom: 19
  }
);

var MapBoxStyle = L.tileLayer(
  "https://api.mapbox.com/styles/v1/tandrewsimpson/cjeujps1g0kjw2rpns6kgmcv4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFuZHJld3NpbXBzb24iLCJhIjoiY2ludXlsY3ZsMTJzN3Rxa2oyNnplZjB1ZyJ9.bftIKd0sAwvSIGWxIDbSSw",
  {
    maxZoom: 20,
    opacity: 0.75
  }
);

var Thunderforest_Transport = L.tileLayer(
  "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=39079820db6845f79a313d7d4724e1a9",
  {
    attribution:
    '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    apikey: "39079820db6845f79a313d7d4724e1a9",
    maxZoom: 22
  }
);

var centerCoordinates = [39.99106237125379, -75.14768600463869];

// set up the map; make transit basemap the default
var map = L.map("map", {
  center: centerCoordinates,
  zoom: 12,
  layers: [CartoDB_Positron]
});
map.zoomControl.setPosition("topleft");

var baseLayers = {
  "Mapbox Aerial": MapBoxStyle,
  "CartoDB Light": CartoDB_Positron,
  "Transit Routes": Thunderforest_Transport
};
L.control.layers(baseLayers).addTo(map);

var currentSlide = 0;
var jsonLink1 =
"https://raw.githubusercontent.com/tsimps/tsimps.github.io/master/data/shelter_json_31318.geojson";
var markers;
var shape;
var data;
var stopsRoutesData;
var neighborhoods;
var routeArray = [];

//$.getJSON(jsonLink1).done(function(data){ makeMarkersJSON(data); });
//json = $.getJSON(jsonLink1);

var getData = function() {
  return $.getJSON(jsonLink1).then(function(json) {
    console.log(json);
    return json.features;
  });
  //return data;
};

var slide0 = {
  slideNumber: 0,
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "Philadelphia Bus Ridership: A Visual Story";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML =
    "This project walks through a visualization of various bus ridership data. As you see on the map, Philadelphia has a lot of bus stops and a lot of bus riders (182 million annual unlinked trips). Data for this project is sourced from SEPTA, Automated Passenger Count (APC). These devices sample every run on every bus route each season. This uses data from each 2014-2017 Spring sampling. Data processing was completed in R with help from the beautiful DPLYR package.";
  },
  debug: function() {
    console.log("0");
  },
  visual: function() {
    clearMarkers();
    clearShapes();
    clearSubways();
    resetMap();
    makeMarkers(data).addTo(map);
  }
};

var slide1 = {
  slideNumber: 1,
  title: function() {
    document.getElementById("sidebar-header").innerHTML = "Major Bus Nodes";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML =
    "Philadelphia has a variety of major hubs of bus activity. As you can see in this map, which shows bus stops that average more than 200 daily boardings, these are largely congregated around subway connections but also exist throughout neighborhoods.";
  },
  debug: function() {
    console.log("0");
  },
  visual: function() {
    var input = parseInt(document.getElementById("s1-slide").value);
    document.getElementById("s1-text").value = input;

    clearMarkers();
    clearShapes();
    resetMap();
    //map.addLayer(baseLayers[1]);
    feats = filterFeatureGroup(data, "avg_boards", input);
    makeMarkers(feats).addTo(map);
    mapSubways();
  }
};

var slide2 = {
  slideNumber: 2,
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "Major Bus Nodes: A Closer Look";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML = "Use the dropdown menu below to examine a range of major bus nodes.";
  },
  debug: function() {
    console.log("2");
  },
  visual: function() {
    input = document.getElementById("select-1").value;
    //console.log("input:", input);
    switchToAerial();
    clearMarkers();
    clearShapes();
    clearNeighorhoods();
    makeMarkers(data, 0.75).addTo(map);

    if (input == "value1") {
      map.setView([40.038833582357064, -75.14461964710792], 18);
    }
    if (input == "value2") {
      map.setView([39.959970794994184, -75.2248701248027], 18);
    }
    if (input == "value3") {
      map.setView([39.952669439501975, -75.16390199107265], 18);
    }
    if (input == "value4") {
      map.setView([39.92445342234856, -75.16953545116849], 18);
    }
  }
};

var slide3 = {
  slideNumber: 3,
  debug: function() {
    console.log("3");
  },
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "A Closer Look: Busses in the Germantown Neighborhood";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML = "At times it can be useful to see what routes go through a particular neighobrhood. This shows all of the routes in Germantown, a historic North Philadelphia neighobrhood. You can see the particular imporance of Route 23, a former trolley line that is closely related to the neighobrhood's identity and is one of the heaviest trafficked routes in Philadelphia. Route 26 is also seen as a major link to the Broad Street Line.";
  },
  visual: function() {
    var germantownRoutes = [18, 23, 26, 53, 65, 704, 706, 707, 801, 802];
    clearMarkers();
    clearShapes();
    switchToLite();
    //map.setZoom(14);
    map.setView([40.03770816512223, -75.17399311065675], 14);
    resetMap();
    neighborhoods.addTo(map);

    for (var i = 0; i < germantownRoutes.length; i++) {
      makeShape(germantownRoutes[i]).addTo(map);
      feats = filterFeatureGroup(stopsRoutesData, "ROUTE", germantownRoutes[i]);
      makeMarkers(feats, 0.6).addTo(map);
    }

    //map.fitBounds(markers.getBounds());
  }
};

var slide4 = {
  slideNumber: 4,
  debug: function() {
    console.log("3");
  },
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "Examining Route Ridership";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML =
    "This shows the ridership garnered by each stop on a particular route, changable by the user input below. Feel free to explore different routes.";
  },
  visual: function() {
    // get input
    input = $("input[id=number-input1]").val();

    switchToLite();
    route = input;
    clearMarkers();
    clearShapes();
    clearNeighorhoods();
    makeShape(route).addTo(map);
    feats = filterFeatureGroup(stopsRoutesData, "ROUTE", route);
    makeMarkers(feats, 0.75).addTo(map);
    map.fitBounds(markers.getBounds());

    if (event.keyCode === 13) {
      route = input;
      clearMarkers();
      clearShapes();
      makeShape(route).addTo(map);
      feats = filterFeatureGroup(stopsRoutesData, "ROUTE", route);
      makeMarkers(feats, 0.75).addTo(map);
      map.fitBounds(markers.getBounds());
    }
  }
};

var slide5 = {
  slideNumber: 5,
  debug: function() {
    console.log("4");
  },
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "Examining the Routes of Congestion";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML =
    "Using R scripts to process hundreds of thousands of bus runs, this shows the average speed of a bus passing through each stop, measured by the time it takes to travel between the shown stop and the next stop (because each bus is time stamped at each stop. Notice the four main situations: (1) Reliably fast (bigger, green marker), (2) reliably slow (small green marker), (3) unpredictable yet fast (bigger, red marker), (4) unpredictable and slow (small red marker). Reliability here is measured by the standard deviation of the velocity of busses at each stop throughout the day.";
  },
  visual: function() {
    input = $("input[id=number-input1]").val();

    clearMarkers();
    clearShapes();

    route = input;
    clearMarkers();
    clearShapes();
    makeShape(route).addTo(map);
    feats = filterFeatureGroup(stopsRoutesData, "ROUTE", route);
    //console.log(feats);
    makeMarkers(feats, 0.75, "velocity_volatility").addTo(map);
    map.fitBounds(markers.getBounds());

    if (event.keyCode === 13) {
      route = input;
      clearMarkers();
      clearShapes();
      makeShape(route).addTo(map);
      feats = filterFeatureGroup(stopsRoutesData, "ROUTE", route);
      //console.log(feats);
      makeMarkers(feats, 0.75, "velocity_volatility").addTo(map);
      map.fitBounds(markers.getBounds());
    }
  }
};

var slide6 = {
  slideNumber: 6,
  debug: function() {
    console.log("6");
  },
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "The Best Performing Routes";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML =
    "The best performing routes, measured by operating ration (the level to which revenues cover expenses), almost all follow the same narrative. 8 out of 10 of these routes feed the two major rail lines. The two highest performing routes, the 60 and the 54, serve both! The two outliers, the 17 and the 33, essentially mirror each other a North-South trunk routes parrelel to the Broad Street Line. These two are high performing, despite competition from the Route 2. They are also a great visual representation of the need for spacing between heavy rail and bus. While a few more blocks of space would be good, 5 blocks is a minimum. These routes could also benefit by circling at City Hall and letting riders use the MFL to continue to Old City.";
  },
  visual: function() {
    var input = parseInt(document.getElementById("s2-slide").value);
    document.getElementById("s2-text").value = input;

    var bestRoutes = [60, 54, 59, 6, 79, 66, 56, 33, 17, 46];
    clearMarkers();
    clearShapes();

    for (var i = 0; i < input; i++) {
      makeShape(bestRoutes[i]).addTo(map);
      feats = filterFeatureGroup(stopsRoutesData, "ROUTE", bestRoutes[i]);
      makeMarkers(feats, 0.6).addTo(map);
    }
  }
};

var slide7 = {
  slideNumber: 7,
  debug: function() {
    console.log("7");
  },
  title: function() {
    document.getElementById("sidebar-header").innerHTML =
    "The Worst Perfoming Routes";
  },
  body: function() {
    document.getElementById("sidebar-text").innerHTML =
    "These poorly performing routes also share the same basically qualities, namely: disorder. The rouets meander across city blocks with little rhyme or reason. The worst route, the 35, runs in a circle through the Northwest. While many of these routes run into suburban counties and therefore do not have ridershiop shown at these stops, it is clear that they are largely circituitous routes that often don't go anywhere. Route 2 is shown here running parrelel and just blocks from the BSL and the Route 17, providing competing and poorly performing service. Perhaps most interesting is the 61. Running down Ridge Avenue and criss crossing the grid, it competes with myriad other services while being significantly slowed down by the diagonal route conflicts.";
  },
  visual: function() {
    var input = parseInt(document.getElementById("s2-slide").value);
    document.getElementById("s2-text").value = input;

    var worstRoutes = [35, 77, 27, 88, 80, 37, 61, 2, 44, 38];
    clearMarkers();
    clearShapes();

    for (var i = 0; i < input; i++) {
      makeShape(worstRoutes[i]).addTo(map);
      feats = filterFeatureGroup(stopsRoutesData, "ROUTE", worstRoutes[i]);
      makeMarkers(feats, 0.6).addTo(map);
    }
    map.setZoom(11);
  }
};

var slideDeck = [
  slide0,
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7
];

function buttonControl() {
  var y = document.getElementById("button-backward");
  if (currentSlide === 0) {
    y.style.display = "none";
  } else {
    y.style.display = "";
  }

  var x = document.getElementById("button-forward");
  if (currentSlide === slideDeck.length - 1) {
    x.style.display = "none";
  } else {
    x.style.display = "";
  }

  var z = document.getElementById("number-input1");
  var filterHead = document.getElementById("filter-head");
  if ((currentSlide === 4) | (currentSlide === 5)) {
    z.style.display = "";
    filterHead.style.display = "";
  } else {
    z.style.display = "none";
    filterHead.style.display = "none";
  }

  var s1Head = document.getElementById("s1-head");
  var s1Slide = document.getElementById("s1-slide");
  var s1Text = document.getElementById("s1-text");
  if (currentSlide === 1) {
    s1Head.style.display = "";
    s1Slide.style.display = "";
    s1Text.style.display = "";
  } else {
    s1Head.style.display = "none";
    s1Slide.style.display = "none";
    s1Text.style.display = "none";
  }

  var s2Head = document.getElementById("s2-head");
  var s2Slide = document.getElementById("s2-slide");
  var s2Text = document.getElementById("s2-text");
  if ((currentSlide === 6) | (currentSlide === 7)) {
    s2Head.style.display = "";
    s2Slide.style.display = "";
    s2Text.style.display = "";
  } else {
    s2Head.style.display = "none";
    s2Slide.style.display = "none";
    s2Text.style.display = "none";
  }

  var selectHead = document.getElementById("select-1-head");
  var selector = document.getElementById("select-1");
  if (currentSlide === 2) {
    selectHead.style.display = "";
    selector.style.display = "";
  } else {
    selectHead.style.display = "none";
    selector.style.display = "none";
  }
  //select-1
}

// go forward a slide
function advanceSlide() {
  // increment to next item in slide deck
  currentSlide += 1;
  buttonControl();
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
  buttonControl();

  slideDeck[currentSlide].title();
  slideDeck[currentSlide].body();
  slideDeck[currentSlide].visual();

  return slideDeck[currentSlide];
}

// normalization the ridership to scale the markers
normalize = val => {
  var x;
  if (isNaN(val)) {
    x = 2;
  } else {
    if (val < 10) {
      x = 3;
    } else {
      x = Math.sqrt(val);
    }
    //if (val > 10) {x = Math.sqrt(val);}
  }
  return x;
};
var markerArray = [];
// map the stop makers from a json file
function makeMarkers(dat, opacity = 0.2, radiusSource = "avg_boards") {
  //console.log("JSON", json);

  // create layer group of station markers
  markers = L.featureGroup(
    _.map(
      dat,
      function(feature) {
        //console.log(feature.properties.avg_boards);
        if (radiusSource === "avg_boards") {
          radius = normalize(feature.properties[radiusSource]);
          color = "#4CAF50";
          //popup =
        }

        if (radiusSource === "velocity_volatility") {
          var velo = feature.properties.avg_velocity; // size by speed
          //radius = -Math.log(velo)+10;
          //radius = velo / (feature.properties.velocity_volatility / 3);
          radius = velo;

          // color by volatility
          if (feature.properties.velocity_volatility > 8) {
            color = "#ba000d";
          } else if (feature.properties.velocity_volatility > 6) {
            color = "#ff7961";
          } else if (feature.properties.velocity_volatility > 4) {
            color = "#ffcccb";
          } else {
            color = "#80e27e";
          }

          // popup = (add volatility and speed info)
        }

        var pathOpts = {
          //radius: allStops[i].Ridership * 1.75,
          radius: radius,
          fillColor: color,
          stroke: false,
          fillOpacity: opacity
        };

        return L.circleMarker(
          [feature.properties.Latitude, feature.properties.Longitude],
          pathOpts
        ).bindPopup(
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
    )
  );
  markerArray.push(markers);
  return markers;
}

// take in a json file and filter out based on values
function filterFeatureGroup(dat, field, value) {
  var filteredData = [];

  // filter field based on value
  _.each(dat, function(features) {
    //console.log(features.properties[field]);
    //feat += 1;
    if (field == "routeNumbers") {
      //console.log('filter by route');
      var str = features.properties[field];
      //console.log(str);
      if (str.includes(value)) {
        filteredData.push(features);
      }
    } else if (field == "ROUTE") {
      //console.log('filter by ROUTE');
      var ROUTE = features.properties[field];
      //console.log(r);
      if (ROUTE == value) {
        filteredData.push(features);
      }
    } else if (field == "Stopid") {
      //console.log('filter by ROUTE');
      var stopid = features.properties[field];
      //console.log(stopid);
      if (stopid === value) {
        filteredData.push(features);
      }
    } else {
      if (features.properties[field] > value) {
        filteredData.push(features);
      }
      //console.log(features.properties[field]); //how to refer to a value
    }
  });
  //console.log(filteredData);

  return filteredData;
}

function clearMarkers() {
  if (markers != null) {
    //markers.removeFrom(map);
    _.each(markerArray, function(feature) {
      feature.removeFrom(map);
    });
  }
}
function clearShapes() {
  if (shape != null) {
    shape.removeFrom(map);
    _.each(routeArray, function(feature) {
      feature.removeFrom(map);
    });
  }
}

function resetMap() {
  map.addLayer(CartoDB_Positron);
  map.setView(centerCoordinates, 12);
}

function switchToAerial() {
  map.addLayer(MapBoxStyle);
  map.removeLayer(CartoDB_Positron);
  map.removeLayer(Thunderforest_Transport);
}

function switchToLite() {
  map.addLayer(CartoDB_Positron);
  map.removeLayer(MapBoxStyle);
  map.removeLayer(Thunderforest_Transport);
}

function switchToTransport() {
  map.addLayer(Thunderforest_Transport);
  map.removeLayer(MapBoxStyle);
  map.removeLayer(CartoDB_Positron);
}

function clearNeighorhoods() {
  if (neighborhoods != null) {
    neighborhoods.removeFrom(map);
  }
}

// bring in a kml file, conver to L.geojson
function makeShape(route) {
  var customLayer = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
    style: function(feature) {
      return { color: "#017c80" };
    },

    filter: function(feature) {
      //console.log(feature.geometry.geometries); //undefined
      feature.geometry.geometries.pop(); // lazy way of ditching the point
      return feature;
    }
  });

  var routeShapeLayer = omnivore.kml(
    "https://raw.githubusercontent.com/tsimps/midterm-project/master/KMLs/" +
    route +
    ".kml",
    null,
    customLayer
  ).bindTooltip('Route ' + route);

  shape = routeShapeLayer;
  routeArray.push(routeShapeLayer);
  return routeShapeLayer;
}

var subwayRouteArray = [];

function makeMFL(opc = 1) {
  var mflSyle = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
    style: function(feature) {
      return { color: "#F74BF", fillOpacity: opc };
    }
  });
  var mfl = omnivore.kml(
    "https://raw.githubusercontent.com/tsimps/midterm-project/master/KMLs/" +
    "MFL" +
    ".kml"
  );
  //mfl.bindTooltip("my tooltip text").openTooltip();
  subwayRouteArray.push(mfl);
  return mfl;
}

function makeBSL(opc = 1) {
  var bslSyle = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
    style: function(feature) {
      return { color: "#FF970F", fillOpacity: opc, opacity: opc };
    }
  });
  var bsl = omnivore.kml(
    "https://raw.githubusercontent.com/RajatBhageria/Real-Time-Septa/master/bsl.kml",
    null,
    bslSyle
  );
  subwayRouteArray.push(bsl);
  return bsl;
}

function mapSubways(opacity) {
  makeMFL(opacity);
  makeBSL(opacity);
  _.each(subwayRouteArray, function(feature) {
    feature.addTo(map);
  });
}

function clearSubways() {
  if (subwayRouteArray.length > null) {
    _.each(subwayRouteArray, function(feature) {
      feature.removeFrom(map);
    });
  }
}

function mapNeighborhood(hood) {
  return L.polygon(hood.geometry.coordinates); // coordinates are flipped
}

// takes in an array of neighborhood objects and returns a map of them, with the "emphasis" being visually prominant
function mapNeighborhoods(neighborhoodData) {
  var neighborhoodCollection = L.featureGroup();

  _.each(neighborhoodData, function(feature) {
    console.log(feature);
    neighborhoodCollection.addLayer(mapNeighborhood(feature));
  });

  return neighborhoodCollection;
}

$(document).ready(function() {
  buttonControl();
  $.getJSON(jsonLink1).done(function(json) {
    //console.log(json);
    data = json.features;
    slide0.visual();
  });
  stopsRoutesData = $.getJSON(
    "https://raw.githubusercontent.com/tsimps/midterm-project/master/data/stops_routes_full.geojson"
  ).done(function(json) {
    stopsRoutesData = json.features;
  });
  $.getJSON('https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson')
  .done(function(json){
    var customLayer = L.geoJson(null, {
      style: function(feature) {
        return {fill: true, opacity: 0.25, color: 'red'};
      },
      filter: function(feature) {
        return feature.properties.NAME.includes("GERMANTOWN");//feature.properties.name == "GERMANTOWN";
      }
    });

    neighborhoods = omnivore.geojson('https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson', null, customLayer);
  });
});

//https://raw.githubusercontent.com/tsimps/midterm-project/master/data/neighborhoods.geojson

// could be used to dynamically size markers by zoom
// this is complicated by the fact that the markers object is a layer group made
// up of the actual markers. It's possible but hard to do.

/*
map.on('zoomend', function() {
  var currentZoom = map.getZoom();
  console.log('CURRENTZOOM', currentZoom);

  if (currentZoom > 15) {
    console.log(markers.getLayers()[0].options.radius);

    markers.setStyle(
      { radius: currentZoom * 2, opacity: 1 }
    );
    //markers.setSyle({
    //radius: markers.eachLayer(function(layer){return layer.options.radius;})
    //});

  } else {
    markers.setStyle(
      { radius: 10, opacity: 1 }
    );

  }});
  */
