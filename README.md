node-gridfs-http-frontend
=========================

A http forntend for serving files form MongoDB's GridFS

```shell
$ gridfs-http-frontend --config=path_to_config.js
```
config.js


```javascript

  exports = module.exports = {
    listen: {
      address: process.env.HOSTNAME,
      port: process.env.PORT || 3000,
    },
    backend: process.env.DATABASE_URL || "mongodb://127.0.0.1/test"

  };

```
#### gridfs tool
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
