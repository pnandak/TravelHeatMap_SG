# This R script scrapes all the post codes in Singapore
# from http://sgp.postcodebase.com. I have already scraped
# and shared the complete list in this repository. Hence,
# I recommend that you NOT rerun this, as it will create unwanted
# server loads for them.
# 
# NOTE: This scraper, as most scrapers, is sensitive to site layout.
# If the site layout has changed, this may not work. You would have to
# modify the script as well if you intend to scrape postcodes from a
# different site (for a different country?).
#
# Date run: Jun 2015

# load XML package 
library(XML)

url <- "http://sgp.postcodebase.com/all"

# df = data frame that stores all postcodes and region
# fetch page 1 and format df to appropriate format
df <- readHTMLTable(url,which=1) # scrape page 1
names(df) <- c("ID","PostalCode","Region") # name columns

# fetch & scrape each page of postcodes one at a time
for (i in 1:1242) { # 1242 pages on the site (manually discovered)
	print(paste("Checking page ",i)) # for keeping track
	url <- paste("http://sgp.postcodebase.com/all?page=",i) # construct URL
	data <- readHTMLTable(url,which=1) # scrape page
	names(data) <- c("ID","PostalCode","Region") # name columns
	df <- rbind(df,data) # add on to existing data frame
}

# remove "ID" column -- not needed
df <- df[!(names(df) %in% c("ID"))]

#write out as table
write.table(df,file="../data/postcodes_regions_sg.csv",sep=",",row.names=F,col.names=F)
