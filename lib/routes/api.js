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
	req.assert('repo',  'Invalid URL.').isUrl();

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
		res.json(400, new Fail(_.pluck(errors, 'msg')));
	} else {
		callback(req.param('email'), req.param('repo'), simpleWriteResponse(res));
	}
}

function simpleReadResponse(res) {
	return function(errors, result) {
		if (errors) {
			res.json(500, new Fail(errors));
		} else {
			res.json(200, new Success(result));
		}
	};
}

function simpleWriteResponse(res) {
	return function(errors) {
		if (errors) {
			res.json(500, new Fail(errors));
		} else {
			res.json(200, new Success());
		}
	};
}

exports.createSubscription = function(req, res) {
	sanitize(req, res, function(email, repourl, callback) {
		db.findSubscription(email, repourl, function(errors, subscriptions) {
			if (errors) {
				return res.json(500, new Fail('Error checking for previous subscription. (' + errors + ')'));
			}

			if (subscriptions.length > 0) {
				return res.json(412, new Fail('Subscription already exists.'));
			}

			var user = github.getUserFromUrl(repourl);
			var repo = github.getRepoFromUrl(repourl);

			github.getPackageJson(user, repo, function(errors, json) {
				if (errors) {
					console.error(errors);
					return res.json(500, new Fail('Package.json not found in the given Github repository. You have not been added to the watchlist.'));
				}

				if (!json.dependencies && !json.devDependencies) {
					return res.json(404, new Fail('No packages defined in package.json. You have not been added to the watchlist.'));
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
	res.json(200, new Success());
	setTimeout(function(){npmalerts.start();}, 500);
};

exports.wakeUp = function(req, res) {
	res.json(200, new Success());
};