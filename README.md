# midterm-project

## TO DO
* !! Handle the odd routes like the G, R, etc. (probably needs to be done in R) !!
* !! Fix popup options based on whether showing all stops or filtered by route !!
* !! Rebuild slide 3 to showcase a particular neighborhood. Would be great to allow user input
but basic functionality will suffice for the midterm !!
  * Should be using total ridership data at each stop and also choosing routes (will need to search the routeNumbers field)
  * Add neighborhood boundaries and select the germantown for visual priority
  * Stretch: allow user to choose a neighborhood and automatically populate the routes and stops
* !! Write a congestion rating formula that considers the avg speed and the
  volatility to produce a congestion score !!

* Add popups across platform to aid user comprehension
* Color stops on the route slides by direction
  * Idea: write a pathOpts function outside of makeMarkers() that is called within
* Integrate material design library with everything
* Add some feature to slide 2 to make it more informative
  * show routes that shop at the stop selected?
  * Add paragraph


## TO DONE
* [DONE] Hide/show buttons and user input
* [DONE] Create and read user input to show a specific route
* [DONE] Read and use the new geojson for the route specific
* [DONE] Write Slide 5 and the logic for displaying congestion Data
* [DONE] Fix the bug where stop data is shown for stops that contain the similar route numbers (i.e. 117 and 17)
* [DONE] User input on bus node sizes
* [DONE] Style the route lines
* [DONE] Filter out the point inside the geoJSON line file
* [DONE] Figure out how to take out multiple routes and markers. Probably needs to rewrite markers and shapes are handled
* [DONE] Figure out Slide 6 and write logic
* [DONE] Figure out Slide 7 and write logic
* [DONE] Add BSL/MFL to the map
* [DONE] Add user option to the last two slides to take input on how many "best" and "worst" routes to show
* [DONE] Change Broad & Olney slide to allow user to choose one of ~4 major transfer Nodes

## EXTENTIONS FOR FINAL
* Integrate Chart.js features to display statics on stops/routes
* Find the markers currently in view, show the routes for those stops dynamically
* Allow the user to select routes and do something
* Add trolley ridership and MFL/BSL ridership and Data
* Show routes with line-weight by ridership/load
