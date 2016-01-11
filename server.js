'use strict';
//call packages used
var mongoose = require('mongoose');
var url=require('url');
var http=require('http');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var miniurl=require('./schema.js');

app.use(bodyParser.urlencoded({ extended: true }));

//set path for static files
app.use('/', express.static(process.cwd() + '/public'));

//on get request at root url return home page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/shorten.html');
    });

//mongoose to connect to shorturl database
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/shorturl', function(err,connect) {
  if(err) return console.log(err);
  console.log('Mongoose connected');
});


mongoose.connection.on('error', function (err) {
    console.log('database error', err)
});
//on posting of a url to /shorturl, start processing url to be shortened
app.post('/shorturl', function(req, res) {
//get the url submitted
var submitUrl = req.body.origurl;
//***need to check if submitUrl has http:// at the start
var re= /^(https?:\/\/)/;
if(re.test(submitUrl)==false) {
  console.log('no http://');
var httpSubmitUrl = 'http://' + submitUrl;
newMini(httpSubmitUrl);

} else {
console.log('attempting to add: ' + submitUrl)
newMini(submitUrl);

}
//***started change to a function to generate new miniurl
function newMini(subUrl) {
  console.log('attempting to add: ' + subUrl)

  //determine the number of urls in the database to assign a sequence id to create the miniurl
  miniurl.find({}).count({}, function(err, count) {
    console.log('number of docs ' + count);
  //create the miniurl
  miniurl.create({origurl: subUrl, seq: count+1, miniurl: 'http://s-u.herokuapp.com/' + (count+1)}, function(err,result) {
    console.log('added ' + subUrl + ' to the list with sequence: ' + (count+1));
  //probably not the fastest way to do it, but returns the created miniurl from the database and send it to the user
    miniurl.findOne({'origurl': subUrl},{'origurl':1, 'miniurl':1}, function (err, result) {
      if (err) return console.log(err);
      console.log('your short url is: ' + result);
      res.send(result);
    });
  });
  });
}


});



app.get('/:seq', function(req, res) {
//get the url submitted
var seqRetrieve = parseInt(req.params.seq,10);
console.log('url sequence number requested was: ' + seqRetrieve);
//should we check for seq that isn't a number as a filter?
  miniurl.findOne({seq: seqRetrieve}, function (err, findResult) {
    if (err) {
      res.send("url hasn't been created");
  } else {
    res.redirect(findResult.origurl);
  };
  })
})

//route handler for anything other than the root url
    app.use(function(req, res){
        res.sendStatus(404);
    });

//server initialisation
var port = process.env.PORT || 3000;
app.listen(port, function() {
console.log('Express server listening on port: ' + port);
});
