/* 
 * This script reads in an input file with a list of postcodes
 * and uses the Google Maps Javascript API to mine geocodes (longitude
 * and latitude), and travel time to each postcode, starting from
 * a preset address.
 *
 * WARNING: This WILL cost you money -- there are >100k valid postal code
 * addresses in Singapore alone, and querying Google Maps (Geocode + Directions)
 * services will incur costs for such a large volume. The author is not responsible
 * for any costs incurred by anyone running these scripts!
 *
 * UPDATE: It seems that the Google's Geocoding API sometimes returns
 * an error code for a postal code, whereas the Directions API
 * succeeds (i.e it is a valid address). You might have to rerun these 
 * rotten cases again. Do a diff on geocodes.list and travel.time.list to identify them.
*/

/**********************************************************************************
 * Import modules 
 *********************************************************************************/
var GoogleMapsAPI = require('googlemaps');
var util = require('util');
var fs = require('fs');
var LineByLineReader = require('line-by-line');

/**********************************************************************************
 * Change these parameters to your needs and settings
 *********************************************************************************/
var start_address = '<YOUR_STARTING_ADDRESS>'; // self-explanatory?
var publicConfig = {
	key: '<YOUR_GOOGLE_CLOUD_DEVELOPER_KEY>',
	stagger_time:       1000, // for elevationPath
	encode_polylines:   false,
	secure:             true, // use https
};
lr = new LineByLineReader('<PATH_TO_FILE_WITH_LIST_OF_POSTCODES>');
var travelMode = 'walking'; // ('driving','bicycling','walking','transit'). Check availability.
var totalNumPostcodes = 1000; // used for logging, not required

/**********************************************************************************
 * Function declarations and script's main():
 * 	- Creates "geocodes.list" and "travel.time.list" CSV files in data/ folder
 * 	- NOTE: Change lines 53, 55, and 124 if using for different cbuntry.
 *********************************************************************************/
var gmAPI = new GoogleMapsAPI(publicConfig); // setup GoogleMaps API
var count = 0; // for logging purposes

// Uses the Google Geocoding API to fetch Longitude and Latitude of input address
var findGeoCode = function(target_address, callback){
	// geocode API
	var geocodeParams = {
		"address":    target_address,
		"components": "components=country:SG",
		"language":   "en",
		"region":     "sg"
	};

	gmAPI.geocode(geocodeParams, function(err, result){
		if (err)
			throw err;
		if(typeof result.results[0] === "undefined"){
			callback("NA","NA");
		} else {
			callback(result.results[0].geometry.location.lat,result.results[0].geometry.location.lng);
		}
	});
}

// Uses the Google Maps Directions API to fetch travel time
var findTravelTime = function(target_address, callback) {
	
	var request = {
		origin: start_address, 
		destination: target_address,
		mode : travelMode 
	};

	gmAPI.directions(request, function(err, result){
		if (err)
			throw err;
		// for sanity
		if (typeof result.routes[0] === "undefined") {
			callback("NA");
		} else {
			callback(result.routes[0].legs[0].duration.value);
		}
	});
}

// Evaluate each input line (=postcode) and update counter
var evaluateLine = function(line,target_address,callback){
	
	findGeoCode(target_address, function(lat,lng){
		var data = line+','+lat+','+lng+'\n';
		fs.appendFile('data/geocodes.list',data,function(err){
			if (err)
				throw err;
		});
		findTravelTime(target_address, function(time){
			var data = line+','+time+'\n';
			fs.appendFile('data/travel.time.list',data,function(err){
				if (err)
					throw err;
			});
			callback(++count);
		});
	});
}

// LineReader onError callback
lr.on('error',function(err) {
	if (err)
		throw err;
});

// LineReader onLine callback
lr.on('line',function(line) {
	
	// Pause line reading until asynchronous call to evaluate current line is complete.
	lr.pause();

	// asynchronous call to find Geocode and Travel Time + counter update and print to console
	if (line !== ''){
		target_address = line + ' Singapore\n';
		evaluateLine(line,target_address,function(c){
			var pcent = (c*100/totalNumPostcodes).toFixed(2);
			console.log("[Postcode "+line+"] Completed "+c+"/"+totalNumPostcodes+" ("+pcent+"%)");
		});
	}

	// 200ms timeout to not exceed 5000 requests/100 seconds limit set by Google
	setTimeout(function(){lr.resume();},200); // Resume line reading once timeout completes
});

// LineReader onEnd callback
lr.on('end',function() {
	console.log("Finished processing all Postcodes!");
});
