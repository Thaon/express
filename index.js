const express = require('express')
const helmet = require('helmet')
const ExpressPeerServer = require('peer').ExpressPeerServer;

const app = express()

const server = require('http').createServer(app)

// add some security-related headers to the response
app.use(helmet())

//set up our port to either be 5000 or the default environment port if 5000 is not available
PORT = process.env.PORT || 5000

//opens up a communication channel on the specified port
srv = server.listen(PORT)

const options = {
	debug: true
}

//create an instance of the ExpressPeerServer
peerserver = ExpressPeerServer(srv, options);

//set up the app to use the peerserver on the /api route
app.use('/api', peerserver);

//zeit lambda
server.listen(3000, () => {
  console.log('server running')
})

//routing
app.get('/', function (req, res) {
  res.send('Hello, this is the root of our service!')
})

module.exports = app
