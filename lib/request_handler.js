
var url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mongo = require('mongodb'),
    extend = require('extend'),
    GridFS = require('gridfs-stream'),



exports = module.exports = function(db){

  var gfs = GridFS(db, mongo);

  return function(request, response){

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


  }
}
