'use strict';

//call packages used
var express = require('express');
var app = express();

//set port for server to listen on - change this to 8080 for deployment
var port = process.env.PORT || 8080;

app.use('/', express.static(process.cwd() + '/public'));

app.get('/', function (req,res) {
  res.sendFile(__dirname + '/public/index.html')
});

app.get('/whoami', function (req,res) {
var ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
var language = req.headers['accept-language'].split(",")[0];
var software = re.exec(req.headers['user-agent'])[1];
var headerReturn={'ipaddress': ipaddress, 'language': language, 'software': software};
console.log(req.headers);
res.send(JSON.stringify(headerReturn));
});

//server status message
app.listen(port);
console.log('Server started! At http:localhost: ' + port);
