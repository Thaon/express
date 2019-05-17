const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//api test
app.get("/hi", (request, response) => {
    response.send("Hello world!");
});


var database, collection;

const CONNECTION_URL = "mongodb+srv://root:root@lab10-ojovu.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Lab10";

//save a new note
app.post("/notes", (request, response) => {
    
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            response.send(error);
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Notes");

        collection.insert(request.body, (error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result.result);
        });
    });
});
//we will use the following template for notes: '{"name":"","body":""}'

//get all notes
app.get("/notes", (request, response) => {

    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            response.send(error);
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Notes");


        collection.find({}).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });
});

//get a single note
app.get("/notes/:id", (request, response) => {
    
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            response.send(error);
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Notes");

        collection.find({}).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }

            //parse the request into a number
            var numberID = parseInt(request.params.id);
            
            //only return a response if it is valid
            if (numberID >= result.length)
            	response.send("Not enough elements in database")
            else
	            response.send(result[numberID]);
        });
    });
});

app.put('/notes/:id', (req, res) => {
  	MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            response.send(error);
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Notes");

        collection.find({}).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }

            //parse the request into a number
            var numberID = parseInt(request.params.id);
            
            //only return a response if it is valid
            if (numberID >= result.length)
            	response.send("Not enough elements in database")
            else
            {
            	//grab the note's actual ID and use it to update the note
            	collection.update({_id:ObjectId(result[numberID])}, {$set: {"body":request.body.body}})
	            response.send("Updated!");
            }
        });
    });
});

app.delete('/notes/:id', (req, res) => {
	MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            response.send(error);
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Notes");

        collection.find({}).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }

            //parse the request into a number
            var numberID = parseInt(request.params.id);
            
            //only return a response if it is valid
            if (numberID >= result.length)
            	response.send("Not enough elements in database")
            else
            {
            	//grab the note's actual ID and use it to update the note
            	collection.deleteOne({_id:ObjectId(result[numberID])}, (err, result) => {
					if(err) {
					throw err;
					}
					res.send('user deleted');
				});
            }
        });
    });
});

//this last line is required by zeit since we are stateless
module.exports = app;