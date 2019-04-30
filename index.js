const express = require('express')
const helmet = require('helmet')
var cors = require('cors')
const ExpressPeerServer = require('peer').ExpressPeerServer;

const app = express()

// add some security-related headers to the response
app.use(helmet())
app.use(cors())

app.options('*', cors())

//set up our port to either be 5000 or the default environment port if 5000 is not available
PORT = process.env.PORT || 5000

//opens up a communication channel on the specified port
srv = app.listen(PORT)

const options = {
	allow_discovery: true,
	debug: true, proxied: true
}

//create an instance of the ExpressPeerServer
peerserver = ExpressPeerServer(srv, options);

//set up the app to use the peerserver on the /api route
app.use('/', peerserver);

//routing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
})
module.exports = app
