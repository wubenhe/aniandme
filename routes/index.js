var express = require('express');
var router = express.Router();

var jsdom = require('jsdom'), request = require('request'), url = require('url'), _ = require('lodash'),  Promise = require('promise'); 

/* GET home page. */
router.get('/', function(req, res, next) {

  var items = new Array(); 
    var body = ''; 
    
    for(var i = 10; i > 0; i--) {
        (function(i){
        var p = new Promise(function (resolve, reject) {
    jsdom.env(
      "http://www.tubeoffline.com/downloadFrom.php?host=AnimeToon&video=http%3A%2F%2Fwww.animetoon.org%2Fpeppa-pig-season-4-episode-"+i,
      ["http://code.jquery.com/jquery.js"],
      function (err, window) {
        if(window) {
        var $ = window.$;
        console.log($('a[download]').attr('href'));
        //res.append($('a[download]').attr('href'));
        //items.push($('a[download]').attr('href')); 
        //resolve($('a[download]').attr('href')); 
        resolve({
            'href':$('a[download]').attr('href'), 
            'title':'peppa-pig-season-4-episode-'+i+'.mp4'
        }); 
        body += $('a[download]').attr('href') + "\n"; 
        }
        else {
            resolve({
            'href':'', 
            'title':'peppa-pig-season-4-episode-'+i+'.mp4'
        });
        }
      }
    );
        });
        items.push(p); 
        })(i); 
    }
    Promise.all(items).then(function(values){
        console.log(values); 
        //res.end(body);
        res.render('index', { title:'download', items : values });
        //res.end();
    }); 
  
});

module.exports = router;
