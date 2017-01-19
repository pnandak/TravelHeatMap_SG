library(ggplot2)
library(ggmap)

# read in data
geocodes <- read.csv("../data/geocodes.list",sep=",",header=F)
time <- read.csv("../data/travel.time.list",sep=",",header=F)

# name columns
names(geocodes) <- c("postcode","lat","lon")
names(time) <- c("postcode","time")

# merge datasets
data <- merge(geocodes,time,by=c("postcode"))

#remove NAs
data <- data[complete.cases(data),]

#limit max time to 10hours (because there are postcodes for pulau ubin, which takes 30hrs to walk! completely skews the results!)
data <- data[data$time<36000,]

#compute cycling time
data$cycle_time <- (data$time/3)/3600 # in hours

# Set a bounding box for fetching the map
lat <- c(1.252874,1.478786)                
lon <- c(103.596471,104.023215)   

# fetch Singapore map
sg_map <- get_map(location = c(lon = mean(lon), lat = mean(lat)), zoom = 11, source = "google", color="bw")

# plot heat map using ggmap -- limit lon and lat axes
pdf("singapore.pdf",width=20,height=12)
ggmap(sg_map) +
  scale_x_continuous(limits = lon, expand = c(0, 0)) +
  scale_y_continuous(limits = lat, expand = c(0, 0)) +
  geom_point(aes(x = lon, y = lat, colour = cycle_time), data = data, alpha = .1) +
  scale_colour_gradient(low = "green", high = "red",guide="colourbar")
