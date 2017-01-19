# Heat Map of Travel Time in Singapore (Walking/Cycling)

## Status
. Scrape Singapore Postcodes [**Complete**]

. Data mine Geocodes and Travelling Time from Google Maps API [*Ongoing*]

. Plot the travel heat map [*Ongoing*] -- if you have some advice on how to do this aesthetically in R, please get in touch!

## Instructions
1. You need nodejs/npm installed on your system. If you intend to use my scraper, you will also need R.
2. Run `npm install` inside directory to install the node\_modules required for this project
3. Edit `run.js` script to your settings and needs:
    - STARTING\_ADDRESS -- The starting address from which the Directions API will attempt to find a route to all the postcodes you wish to data mine. (I use my own address, for example)
    - GOOGLE\_DEVELOPER\_KEY -- You will need to have a Google Developer account, and activate the Google Geocoding and Directions APIs under your account. There will be a unique key tied to your account (basically a hash), which you need to add to this file.
    - PATH\_TO\_INPUT\_FILE -- This is an input file which contains all the postcodes you want to data mine. Each line is one postcode.
    - TRAVEL\_MODE -- The Directions API supports 4 different traveling modes (driving,bicycling,walking, and transit). Some are only available in certain regions/countries. For example, there is no bicycling mode available for Singapore, so I use walking mode, and guesstimate the cycling time from that.
    - TOTAL\_NUM\_POSTCODES -- Total number of postcodes. This is used to print progress on console, not crucial to functionality but useful.
    - LOCALE -- If you're running this for a different country/region (than Singapore), look through the main portions of the script and edit as required. I've added comments to guide you.
4. `node run.js`

## Description
This JS project reads in an input file with a list of postcodes and uses the Google Maps Javascript API to mine geocodes (longitude and latitude), and travel time to each postcode, starting from a preset address. The data/ folder contains the input/output files I use/generate, e.g. the list of all postcodes in Singapore (postcodes\_sg.list). The scraper, written in R, can be found in the scraper/ folder. Note that scrapers, generally, are very sensitive to the site layout. I scraped all the postcodes back in June 2015, so the scraper might not work now if the site layout has changed.

**Note on scraping**: I would highly recommend that you NOT scrape the postcodes for Singapore again. Scraping can create unwanted server load, and might be downright illegal or frowned upon from the service providers. I am not going to be responsible if you get in trouble. If you do need to scrape for postcodes, I advise doing it in small batches at a time, which is the strategy I adopted. At the end of the day, use discretion.

## WARNING
This WILL cost you money -- there are >100k valid postal code addresses in Singapore alone, and querying Google Maps (Geocode + Directions) services will incur costs for such a large volume. I am NOT responsible for any costs incurred by anyone running these scripts!

## UPDATE
It seems that the Google's Geocoding API sometimes returns an error code for a postal code, whereas the Directions API succeeds (i.e it is a valid address). You might have to rerun these rotten cases again. Do a diff on geocodes.list and travel.time.list to identify them.

## Contact
Drop me an [email](mailto:sidmontu@gmail.com) if something is not working or you have questions.
