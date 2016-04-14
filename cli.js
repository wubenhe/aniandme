#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander'), 
    jsdom = require('jsdom'), 
    request = require('request'), 
    url = require('url'), 
    _ = require('lodash'), 
    fs = require('fs'), 
    http = require('follow-redirects').https, 
    Promise = require('promise'); 



var downloadFile = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

var getUrlParam = function ( name, url ) {
  if (!url) url = window.location.href
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : decodeURIComponent(results[1]);
}

var fetchDownloadLink = function(name) {
    var p = new Promise(function (resolve, reject) {
        var tube = "http://www.tubeoffline.com/downloadFrom.php?host=AnimeToon&video=http%3A%2F%2Fwww.animetoon.org%2F" + name; 
        console.log(tube); 
        jsdom.env(
            tube, 
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
            if(window) {
                var $ = window.$;
                
                var url = $('a[download]').attr('href'); 
                var filename = name + '.mp4'; 
                var google = getUrlParam('url', url); 
                try{
                    var buf = new Buffer(google, 'base64');
                    url = buf.toString(); 
                }catch(e){
                    console.log(e); 
                }
                
                console.log('download %j - url %j', name, url);
                downloadFile(url, filename, function(message){
                    if(message) {
                        reject(); 
                    }
                    else {
                        resolve(); 
                    }
                }); 
                
            }
          }
        ); 
    });
    i--; 
    p.then(function(){
        if(i > stop) {
           fetchDownloadLink (program.name + "-" + i);  
        }
    }); 
}

program. 
    version('stop.0.1'). 
    option('-n --name [value]', 'Program name'). 
    option('-e --episode <n>', 'End of episode', parseInt).
    option('-s --stop <n>', 'stop episode', parseInt).
    parse(process.argv); 

console.log('Program Name %j', program.name); 
console.log('End of episode %j', program.end); 

var i = program.episode;
var stop = program.stop || 0; 
for(var j = i < 5 ? i : 5; j > 0; j--) {
    fetchDownloadLink (program.name + "-" + i);  
}




