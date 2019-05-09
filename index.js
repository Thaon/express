const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://root:root@lab10-ojovu.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Lab10";

const PORT = process.env.PORT || 3000;

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(PORT, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("Notes");
        console.log("Connected to `" + DATABASE_NAME + "`!");
        console.log("on port: " + PORT);
    });
});

//we are connected! let's add some routes:

//save a new note
app.post("/note", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});
//we will use the following template for notes: '{"name":"","body":""}'

app.get("/hi", (request, response) => {
        response.send("Hello world!");
});

//get all notes
app.get("/notes", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

//get a single note
app.get("/notes/:id", (request, response) => {
    collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

//this last line is required by zeit since we are stateless
module.exports = app;