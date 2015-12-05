var express = require('express');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

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

app.use(methodOverride()); // NOTE: It is very important that this module is used before any module that needs to know the method of the request
app.use(allowCrossDomain);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.put('/api/subscriptions', api.createSubscription);
//app.get('/api/subscriptions', api.readSubscriptions);
app.delete('/api/subscriptions', api.deleteSubscription);
app.get('/api/updates', api.readUpdates);
app.get('/api/cron', api.startCron);
app.get('/api/wake', api.wakeUp);

app.listen(port);
