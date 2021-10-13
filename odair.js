// Setup ENV
const dotenv = require('dotenv')
dotenv.config()

// Setup Chat Core Ubicua Cloud Platform
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');

const helmet = require('helmet');

const port = process.env.PORT || 443;

var options = {
	key: fs.readFileSync(process.env.CCS_OPTIONSKEY),
	cert: fs.readFileSync(process.env.CCS_OPTIONSCERT)
};

// Config App Express
var app = express();
app.use(helmet());

var server = require('https').createServer(options, app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', function (req, res) {
	res.send('Hello World')
})

server.listen(port, function () {
	log('Chat Core - Ubicua Cloud Platform - Listening at Port ' + port);
});

process.on('uncaughtException', function (err) {
	return
});

