const express = require('express');
var app = express();

//Following the "Single query" approach from: https://node-postgres.com/features/pooling#single-query

const { Pool } = require("pg"); // This is the postgres database connection module.

// This says to use the connection string from the environment variable, if it is there,
// otherwise, it will use a connection string that refers to a local postgres DB
const connectionString = process.env.DATABASE_URL || "postgres://ta_user:ta_pass@localhost:5432/familyhistory";

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});

app.set("port", (process.env.PORT || 5000))
	.use(express.static(__dirname + "/public"))
	.use(express.json())
	.use(express.urlencoded({extended:true}))
	.get("/getEvents", getEvents)
	.get("/getVolunteer", getVolunteer)
	.get("/getStyles", getStyles)
	.get("/getCat", getCat)
	.listen(app.get("port"), function(){
		console.log("listening on Port:" + app.get("port"));
	});

function getVolunteers(req, res) {
	// First get the person's id
	var id = req.query.id;

	//if(isNaN(id) || id <= 0) {

		getVolunteersFromDb(id, function(error, result) {
			// This is the callback function that will be called when the DB is done.
			// The job here is just to send it back.

			// Make sure we got a row with the person, then prepare JSON to send back
			if (error || result == null) {
				res.status(500).json({success: false, data: error});
			} else {
				res.status(200).json(result);
			}
		});
	//} 
}

function getEvents(req, res) {
	// First get the person's id
	var id = req.query.id;

	//if(isNaN(id) || id <= 0) {

		getEventsFromDb(id, function(error, result) {
			// This is the callback function that will be called when the DB is done.
			// The job here is just to send it back.

			// Make sure we got a row with the person, then prepare JSON to send back
			if (error || result == null) {
				res.status(500).json({success: false, data: error});
			} else {
				res.status(200).json(result);
			}
		});
	//} 
}

function getVolunteer(req, res) {
	// First get the person's id
	var id = req.query.id;

	//if(isNaN(id) || id <= 0) {

		getVolunteerFromDb(id, function(error, result) {
			// This is the callback function that will be called when the DB is done.
			// The job here is just to send it back.

			// Make sure we got a row with the person, then prepare JSON to send back
			if (error || result == null || result.length != 1) {
				res.status(500).json({success: false, data: error});
			} else {
				res.status(200).json(result[0]);
			}
		});
	//} 
}

function getStyles(req, res) {
	// First get the person's id
	var id = req.query.id;

	//if(isNaN(id) || id <= 0) {

		getStylesFromDb(id, function(error, result) {
			// This is the callback function that will be called when the DB is done.
			// The job here is just to send it back.

			// Make sure we got a row with the person, then prepare JSON to send back
			if (error || result == null) {
				res.status(500).json({success: false, data: error});
			} else {
				res.status(200).json(result);
			}
		});
	//} 
}

function getCat(req, res) {
	// First get the person's id
	var id = req.query.id;

	//if(isNaN(id) || id <= 0) {

		getCatFromDb(id, function(error, result) {
			// This is the callback function that will be called when the DB is done.
			// The job here is just to send it back.

			// Make sure we got a row with the person, then prepare JSON to send back
			if (error || result == null || result.length != 1) {
				res.status(500).json({success: false, data: error});
			} else {
				res.status(200).json(result[0]);
			}
		});
	//}
}


//*******************************Get stuff from database*********************************//
function getVolunteersFromDb(id, callback) {
	console.log("Getting events from DB with id: " + id);

	var sql = "SELECT v.name, v.active, v.preferences, p.is_manager FROM volunteer_position AS vp, volunteer AS v, position AS p WHERE p.category_id = $1::int AND vp.volunteer_id = v.id AND vp.position_id = p.id";
	var params = [id];

	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}
		console.log(result);
		callback(null, result.rows);
	});

}

function getEventsFromDb(id, callback) {
	console.log("Getting events from DB with id: " + id);

	var sql = "SELECT e.id, e.category_id, e.start, e.finish, t.name FROM event AS e, event_type AS t WHERE e.category_id = $1::int AND e.type_id = t.id";
	var params = [id];
	
	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}
		console.log(result);
		callback(null, result.rows);
	});

} 

function getVolunteerFromDb(id, callback) {
	console.log("Getting volunteer from DB with id: " + id);

	var sql = "SELECT id, name, active, username, password FROM volunteer WHERE id = $1::int";
	var params = [id];

	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}
		callback(null, result.rows);
	});

} 

function getStylesFromDb(id, callback) {
	console.log("Getting styles from DB with id: " + id);

	var sql = "SELECT id, category_id, name FROM style WHERE category_id = $1::int";
	var params = [id];

	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		callback(null, result.rows);
	});

} 

function getCatFromDb(id, callback) {

	var sql = "SELECT id, name, description FROM category WHERE id = $1::int";
	var params = [id];

	pool.query(sql, params, function(err, result) {
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		callback(null, result.rows);
	});

} 
