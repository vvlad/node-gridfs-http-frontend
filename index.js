#!/usr/bin/env node

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.env.PORT || 3000,
    MongoClient = require('mongodb').MongoClient,
    mongo = require('mongodb'),
    extend = require('extend'),
    Grid = require('gridfs-stream'),
    stream = require('stream');



if(process.argv[2] == undefined){
  console.error("a config file is required");
  process.exit(1);
}

var config = require(process.argv[2]);


MongoClient.connect(config.backend, {db: {native_parser: true}}, function (err, db) {
  if (err) return handleError(err);
  var gfs = Grid(db, mongo)


  http.createServer(function(request, response) {

    var filename = url.parse(request.url).pathname;

    gfs.files.findOne({ filename: filename },function (err, file) {
      if(file){

        var etag = request.headers["if-none-match"],
            if_modified_since = request.headers['if-modified-since'],
            cacheHeaders = {
              'ETag': file.md5,
              'Cache-Control': 'public, max-age=31536000',
              'Last-Modified': file.uploadDate,
              'Expires': "Fri, 01 Jan 2038 01:01:01 UTC"
            };


        if ((etag && etag == file.md5)||(if_modified_since && if_modified_since == file.uploadDate)) {

          response.writeHead(304, cacheHeaders );
          response.end();

        }else{

          var responseHeaders = extend({}, cacheHeaders, {
            'Content-Type': file.contentType,
            'Content-Length': file.length
          });

          response.writeHead(200, responseHeaders);

          readable = gfs.createReadStream({_id: file._id});

          readable.on("error", function(err){
            console.log("Got error while processing stream " + err.message);
            response.end();
          });

          readable.pipe(response);

        }

      }else{
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write("Not found");
        response.end();
      }

    });


  }).listen(config.listen.port, config.listen.address);
  console.log("Listening on http://"+config.listen.address+":"+config.listen.port);


});







