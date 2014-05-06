node-gridfs-http-frontend
=========================

HTTP frontend to serve files from MongoDB's GridFS using nodejs

#### Running
```shell
$ gridfs-http-frontend
```
```shell
$ gridfs-http-frontend --backend=mongodb://my-gridfs.local:27117/gridfs --listen_address=0.0.0.0 --listen_port=3000
```
```shell
$ gridfs-http-frontend --config=path_to_config.js
```

There's also an example Upstart script in the 'upstart' directory

#### Config
Defaults
* backend = mongodb://127.0.0.1:27017/gridfs
* listen_address = 127.0.0.1
* listen_port = 3000

Order of config variable resolution

1. --config=[configfile.js]
2. [executable]/lib/config.js
3. command line args: --backend=mongodb://my-gridfs.local:27117/gridfs --listen_address=127.0.0.1 --listen_port=300

Command line args will override any coming from a config file.

###### Example config.js

```javascript
  exports = module.exports = {
    listen: {
      address: process.env.HOSTNAME,
      port: process.env.PORT || 3000,
    },
    backend: process.env.DATABASE_URL || "mongodb://127.0.0.1/test",
  };
```

#### Requesting files from the Server
GridFS files will then be available at
http://gridfs-http.local:3000/[grid_id]

Optionally - file URLs can have appended a forward slash and (anything else)
e.g. http://gridfs-http.local:3000/[grid_id]/my_nice_filename.jpg

Note this differs from the upstream, which serves files based on filename.

#### GridFS Tool
```shell
$ gridfs ls
Sat Oct 26 2013 21:18:24 GMT+0300 (EEST)  6bb7c31d7ca6538aafa571b62b17118f  package.json
$ gridfs cat package.json
{ ... }
$  gridfs put package.json
Done
$ gridfs
start:  starts the a web server
ls: list the files that are maching the given pattern
cat:  print a file content
rm: removes a file
put:  uploads a file into the grid
help: displays help for a given command
```
