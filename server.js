'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/getHello', (req, res) => {
	console.log('getHello calling getHello')
  res.send('Hello worldddd\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);