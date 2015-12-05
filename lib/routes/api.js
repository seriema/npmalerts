var _ = require('lodash');

var db = require('../db.js');
var github = require('../github.js');
var npmalerts = require('../npmalerts.js');


var Result = function(success, msg) {
  this.success = success;
  this.messages = Array.isArray(msg) ? msg : [msg];
};

var Success = function(msg) {
  return new Result(true, msg || '');
};

var Fail = function(msg) {
  return new Result(false, msg || '');
};


function checkParams(req) {
  req.assert('email', 'Empty email.').notEmpty();
  req.assert('email', 'Invalid email.').isEmail();
  req.assert('repo',  'Empty URL.').notEmpty();
  req.assert('repo',  'Invalid URL.').isURL();

  var errors = req.validationErrors();

  var repo = req.param('repo');
  if (!github.getUserFromUrl(repo) || !github.getRepoFromUrl(repo)) {
    errors = errors || [];
    errors.push({
      param: 'repo',
      msg: 'Invalid Github URL. It should look like this: "https://github.com/seriema/npmalerts.git".',
      value: repo
    });
  }

  return errors;
}

function sanitize(req, res, callback) {
  var errors = checkParams(req);

  if (errors) {
    res.status(400).json(new Fail(_.pluck(errors, 'msg')));
  } else {
    callback(req.param('email'), req.param('repo'), simpleWriteResponse(res));
  }
}

function simpleReadResponse(res) {
  return function(errors, result) {
    if (errors) {
      res.status(500).json(new Fail(errors));
    } else {
      res.status(200).json(new Success(result));
    }
  };
}

function simpleWriteResponse(res) {
  return function(errors) {
    if (errors) {
      res.status(500).json(new Fail(errors));
    } else {
      res.status(200).json(new Success());
    }
  };
}

exports.createSubscription = function(req, res) {
  sanitize(req, res, function(email, repourl, callback) {
    db.findSubscription(email, repourl, function(errors, subscriptions) {
      if (errors) {
        return res.status(500).json(new Fail('Error checking for previous subscription. (' + errors + ')'));
      }

      if (subscriptions.length > 0) {
        return res.status(412).json(new Fail('Subscription already exists.'));
      }

      var user = github.getUserFromUrl(repourl);
      var repo = github.getRepoFromUrl(repourl);

      github.getPackageJson(user, repo, function(errors, json) {
        if (errors) {
          console.error(errors);
          return res.status(500).json(new Fail('Package.json not found in the given Github repository. You have not been added to the watchlist.'));
        }

        if (!json.dependencies && !json.devDependencies) {
          return res.status(404).json(new Fail('No packages defined in package.json. You have not been added to the watchlist.'));
        }

        db.createSubscription(email, repourl, req.param('patch'), callback);
      });
    });
  });
};

exports.readSubscriptions = function(req, res) {
  db.readSubscriptions(simpleReadResponse(res));
};

exports.deleteSubscription = function(req, res) {
  sanitize(req, res, db.deleteSubscription);
};


exports.readUpdates = function(req, res) {
  db.getUpdate(simpleReadResponse(res));
};


exports.startCron = function(req, res) {
  var starting = npmalerts.start();
  if (starting) res.status(200).json(new Success("Starting cron"));
  else res.status(200).json(new Success("Already running cron"));
};

exports.wakeUp = function(req, res) {
  res.status(200).json(new Success());
};
