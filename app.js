var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/whoseturn')

var Users = mongoose.model('users', {name:String, beers: Number, unconfirmed: Number, cookie: String })

app.set('port', (process.env.PORT || 3025));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.render('index');
});

app.get('/beers', function(req, res) {
  Users.find().sort({beers:1}).exec(function(err, result){
    if(err) console.log(err);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  })
});

app.get('/reset', function(req, res) {
  Users.update({}, {$set:{beers:0, unconfirmed:0}}, {multi: true}, function(err, result){
    if(err) console.log(err);
    res.send("done");
  })
});

app.post('/update', function(req, res) {
  Users.update({_id:req.body.id}, {$set:{unconfirmed:0}, $inc:{beers:req.body.qty}}, function(err, result){
    if(err) console.log(err);
    res.send("klart");
  })
});

app.post('/addround', function(req, res) {
  Users.update({name: req.body.user}, {$set:{cookie:req.body.cookie}, $inc:{unconfirmed:1}}, function(err, result){
    if(err) console.log(err);
    res.send("klart");
  });
});

// error handlers
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
