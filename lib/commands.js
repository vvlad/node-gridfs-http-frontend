
var mongo = require('mongodb'),
    http = require('http'),
    GridFS = require('gridfs-stream'),
    fs = require('fs');


function database(config, callback){
  mongo.MongoClient.connect(config.backend, {db: {native_parser: true}}, function (err, db) {
    if(err) {
        console.log('Problem connecting to ' + config.backend);
        console.log('Confirm the mongodb url');
        throw err;
    }
    callback(db);
  });
}

function command(desc, func){
  func.help = desc.slice(1).join("\n");
  func.desc = desc[0];
  return func;
}

exports = module.exports = {

  start: command(
    [ "starts the a web server",
      "--config config.js\n",
      "config.js:\n",
      "\texports = module.exports = {",
      "\t\tlisten: {",
      "\t\t\taddress: '127.0.0.1',",
      "\t\t\tport: 3000,",
      "\t\t},",
      "\t\tbackend: 'mongodb://127.0.0.1/test'",
      "\t};"
    ],
    function(argv, config){

    database(config, function(db){
      console.log("Connected to "+config.backend);
      http.createServer(require("./request_handler")(db)).listen(config.listen.port, config.listen.address);
      console.log("Listening on http://"+config.listen.address+":"+config.listen.port);
    });
  }),
  ls: command(["list the files that are maching the given pattern",
      "[pattern]\n",
      "pattern:\n\ta RegExp that will be used to match the files"
    ],
    function(argv, config){
    var pattern = argv._[0],
        query = {};
    if(pattern!=undefined){
      query.filename = new RegExp(pattern);
    }

    database(config, function(db){
      var gfs = GridFS(db, mongo);
      gfs.files.find(query).toArray(function(err, files){
        files.forEach(function(file){
          console.log(file.uploadDate+"\t"+file.md5+"\t"+file.filename);
        });
        process.exit(0)
      });
    });

  }),
  cat: command(["print a file content",
    "file\n",
    "file:\n\tthe name of the file that will be fetched"
    ],
    function(argv, config){
    var remote = argv._[0];

    if(remote==undefined){
      exports.help("cat");
      process.exit(1);
    }

    database(config, function(db){
      var gfs = GridFS(db, mongo);

      var readStream = gfs.createReadStream({filename: remote});
      readStream.on('end', function(){
        process.exit(0);
      });
      readStream.pipe(process.stdout);

    });

  }),
  rm: command(["removes a file",
    "file\n",
    "file:\n\tthe name of the file that will be removed"
    ], function(argv, config){

      var remote = argv._[0];
      if(remote==undefined){
        exports.help("rm");
        process.exit(1)
      }
      database(config, function(db){
        GridFS(db, mongo).remove({filename: remote}, function(err){
          if(err){
            console.error(err.message);
          }
          process.exit(0);
        });
      });

    }
  ),
  put: command(["uploads a file into the grid",
    "local-file [remote-file]\n",
    "local-file:\n\tthe local file that will be uploaded",
    "remote-file:\n\tthe remote file name that will be stored in the grid",
    ],
    function(argv, config){

    var local = argv._[0],
        remote = argv._[1] || local;

    if(remote==undefined){
      exports.help("put");
      process.exit(1)
    }

    database(config, function(db){
      var gfs = GridFS(db, mongo);

      gfs.remove({filename: remote}, function(err){

        var writeStream = gfs.createWriteStream({filename: remote}),
            readStream = fs.createReadStream(local)
        writeStream.on('close', function(){
          console.log("Done");
          process.exit(0);
        });
        readStream.pipe(writeStream);

      });

    });
  }),
  help: command([
    "displays help for a given command",
    "command",
    "command:\n\t the name of the commant"

  ], function(argv, config){

    var cmd;
    if(typeof argv == 'string') {
      cmd = argv;
    }else{
      cmd = argv._.shift() ||"help";
    }

    console.log(cmd + " "+ exports[cmd].help);
    console.log("");

  })

}
