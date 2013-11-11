var db = require('../db.js');
var github = require('../github.js');


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
        res.send(400, JSON.stringify(errors));
    } else {
        callback(req.param('email'), req.param('repo'), simpleWriteResponse(res));
    }
}

function simpleReadResponse(res) {
    return function(error, result) {
        if (error) {
            res.send(500, error);
        } else {
            res.send(200, JSON.stringify(result));
        }
    };
}

function simpleWriteResponse(res) {
    return function(error) {
        if (error) {
            res.send(500, error);
        } else {
            res.send(200);
        }
    };
}

exports.findSubscription = function(req, res) {
    sanitize(req, res, function(email, repourl, callback) {
    });
};

exports.createSubscription = function(req, res) {
    sanitize(req, res, function(email, repourl, callback) {
        db.findSubscription(email, repourl, function(error, subscriptions) {
            if (error) {
                return res.send(500, 'Error checking for previous subscription. (' + error + ')');
            }

            if (subscriptions.length > 0) {
                return res.send(412, 'Subscription already exists.');
            }

            var user = github.getUserFromUrl(repourl);
            var repo = github.getRepoFromUrl(repourl);

            github.getPackageJson(user, repo, function(error, json) {
                if (error) {
                    console.error(error);
                    return res.send(500, 'Error connecting to Github. You have not been added to the watchlist. (' + error + ')');
                }

                if (!json.dependencies && !json.devDependencies) {
                    return res.send(404, 'No packages defined in package.json. You have not been added to the watchlist.');
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
