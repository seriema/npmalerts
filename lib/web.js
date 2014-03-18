var express = require('express');
var expressValidator = require('express-validator');

var api = require('./routes/api.js');

var port = process.env.PORT || 5000;

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://npmalerts.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.configure(function () {
  app.use(allowCrossDomain);
  app.use(express.logger());
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(expressValidator());
});

app.put('/api/subscriptions', api.createSubscription);
app.get('/api/subscriptions', api.readSubscriptions);
app.del('/api/subscriptions', api.deleteSubscription);
app.get('/api/updates', api.readUpdates);
app.get('/api/cron', api.startCron);
app.get('/api/wake', api.wakeUp);

app.listen(port);

// Configure npm library to use official npm repo.
require('./npm.js').load({});
