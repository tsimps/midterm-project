# midterm-project

## TO DO
* Fill out paragraph sections for each slide
* Handle the odd routes like the G, R, etc. (probably needs to be done in R)
* Color stops on the route slides by direction
  * Idea: write a pathOpts function outside of makeMarkers() that is called within
* Map and toggle to showing routes by ridership (may save for final)
* !! Fix popup options based on whether showing all stops or filtered by route !!
* Integrate material design library with everything
* Write a congestion rating formula that considers the avg speed and the volatility to produce a congestion score
* Add popups across platform to aid user comprehension
* Look at custom styling a MapBoxStyle with BSL/MFL
* Add an opening card
* Change Broad & Olney slide to allow user to choose one of ~4 major transfer Nodes
  * Also needs to show BSL
  * Needs to show routes better
  * The next slide isn't great 


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

## EXTENTIONS FOR FINAL
* Integrate Chart.js features to display statics on stops/routes
* Find the markers currently in view, show the routes for those stops dynamically
* Allow the user to select routes and do something
