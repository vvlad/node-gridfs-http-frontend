

exports = module.exports = {
  requestHandler: require("./request-handler")
}

// if(process.argv[2] != undefined){
//   config = require(process.argv[2]);
// }else{
//   config = require('./config');
// }


// MongoClient.connect(config.backend, {db: {native_parser: true}}, function (err, db) {
//   if (err) return handleError(err);
//   var gfs = Grid(db, mongo)

//   console.log("Connected to "+config.backend);

//   http.createServer(function(request, response) {



//   }).listen(config.listen.port, config.listen.address);
//   console.log("Listening on http://"+config.listen.address+":"+config.listen.port);


// });







