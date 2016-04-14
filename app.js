var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var jsdom = require('jsdom'), request = require('request'), url = require('url'), _ = require('lodash'); 

var routes = require('./routes/index');
var users = require('./routes/users');
var Promise = require('promise'); 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.use('/nodetube', function(req, res){
    var items = new Array(); 
    var body = ''; 
    
    for(var i = 49; i > 47; i--) {
        var p = new Promise(function (resolve, reject) {
    jsdom.env(
      "http://www.tubeoffline.com/downloadFrom.php?host=AnimeToon&video=http%3A%2F%2Fwww.animetoon.org%2Fpeppa-pig-season-4-episode-"+i,
      ["http://code.jquery.com/jquery.js"],
      function (err, window) {
        var $ = window.$;
        console.log($('a[download]').attr('href'));
        //res.append($('a[download]').attr('href'));
        //items.push($('a[download]').attr('href')); 
        //resolve($('a[download]').attr('href')); 
        //body += $('a[download]').attr('href') + "\n"; 
      }
    );
        });
        items.push(p); 
    }
    Promise.all(items).then(function(values){
        //console.log(values); 
        //res.end(body);
    }); 
    
    
//    request({uri: 'http://www.tubeoffline.com/downloadFrom.php?host=AnimeToon&video=http%3A%2F%2Fwww.animetoon.org%2Fpeppa-pig-season-4-episode-48'}, function(err, response, body){
//                var self = this;
//        self.items = new Array();//I feel like I want to save my results in an array
//        //Just a basic error check
//                if(err && response.statusCode !== 200){console.log('Request error.');}
//                //Send the body param as the HTML code we will parse in jsdom
//        //also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
//        jsdom.env({
//                        html: body,
//                        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
//                }, function(err, window){
//            //Use jQuery just as in a regular HTML page
//                        var $ = window.jQuery;
//                         
//                        console.log($('a[download]').attr('href'));
//                        res.end($('a[download]').attr('href'));
//                });
//        });

}); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
