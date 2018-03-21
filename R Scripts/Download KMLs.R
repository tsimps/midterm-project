# FUCK UP SOME KMLS

setwd("/Users/tandrewsimpson/Documents/midterm-project/KMLs")

list <- c(1:40, 42:47, '47M', 48, 50, 52:62, 64:68, 70, 73, 75, 77:80, 84, 88, 89, 90:99, 101:102,
          103:115, 117:120, 123:133, 150, 201, 204:206, 310, "BSO", "MFO",
          'G', "H", "XH", "J", "K", "L", "R", "LUCY", "BLVDDIR", "MFL", "BSL")

i <- 0
n <- 1:length(list)
for (i in n) { 
  url <- paste('http://www3.septa.org/transitview/kml/', list[i], '.kml',sep='')
  download.file(url, paste(list[i], '.kml', sep=''), quiet = TRUE)
}


download.file('https://raw.githubusercontent.com/RajatBhageria/Real-Time-Septa/master/bsl.kml', paste('BSL', '.kml', sep='')
              