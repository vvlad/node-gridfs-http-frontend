node-gridfs-http-frontend
=========================

A http forntend for serving files form MongoDB's GridFS

```shell
gridfs-http-frontend --config=path_to_config.js
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
