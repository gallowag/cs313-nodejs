var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/calculate', function(request, response) {
	handle(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function handle(request, response) {
	var requestUrl = url.parse(request.url, true);

	console.log("Query parameters: " + JSON.stringify(requestUrl.query));

	// TODO: Here we should check to make sure we have all the correct parameters

	var type = requestUrl.query.type;
	var weight = Number(requestUrl.query.weight);

	calculateRate(response, type, weight);
}

function calculateRate(response, type, actual_weight) {
	type = type.toLowerCase();
	weight = Math.ceil(actual_weight);

	var result = 0;

	if (type == "stamped") {
		if (weight > 3) {
			result =  1.13;
		} else {
			result = ((weight - 1) * .21) + .50;
		}
	} else if (type == "metered") {
		if (weight > 3) {
			result =  1.10;
		} else {
			result = ((weight - 1) * .21) + .47;
		}		
	} else if (type == "flat") {
		if (weight > 12) {
			result =  3.52;
		} else {
			result = ((weight - 1) * .21) + 1.00;
		}		
	} else if (type == "retail") {
		if (weight > 12) {
			result = 5.50;
		} else if (weight < 5) {
			result =  3.50;
		} else if (weight < 9) {
			result = 3.75;
		} else {
			result = ((weight - 8) * .35) + 3.75;
		}
	} else {
		// It would be best here to redirect to an "unknown operation"
		// error page or something similar.
	}

	// Set up a JSON object of the values we want to pass along to the EJS result page
	var params = {type: type, weight: actual_weight, result: result};

	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	response.render('pages/result', params);

}