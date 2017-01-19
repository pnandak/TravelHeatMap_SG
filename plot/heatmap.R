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

# fetch Singapore map
sg_map <- get_map(location = "Singapore", zoom = 11)

# plot heat map using ggmap
pdf("singapore.pdf",width=20,height=12)
ggmap(sg_map,extent = "device") +
#	geom_density2d(data = data,aes(x = lon, y = lat), size = 0.3) + 
	stat_density2d(data = data, aes(x = lon, y = lat, fill = ..level.., alpha = ..level..), size = 0.01, bins = 16, geom = "polygon") + 
	scale_fill_gradient(low = "green", high = "red") + 
	scale_alpha(range = c(0, 0.3), guide = FALSE)

