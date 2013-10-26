



exports = module.exports = {
  listen: {
    address: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000,
  },
  backend: "mongodb://127.0.0.1/yourDatabaseName"

};
