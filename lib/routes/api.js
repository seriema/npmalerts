var db = require('../db.js');
var github = require('../github.js');


function checkParams(req, callback) {
    req.assert('email', 'Empty email.').notEmpty();
    req.assert('email', 'Invalid email.').isEmail();
    req.assert('repo',  'Empty URL.').notEmpty();
    req.assert('repo',  'Invalid URL.').isUrl();

    var errors = req.validationErrors();
    if (errors) {
        callback(errors);
    } else {
        callback(null, req.param('email'), req.param('repo'));
    }
}

function sanitize(req, res, callback) {
    checkParams(req, function(errors, email, repo) {
        if (errors) {
            res.send(400, JSON.stringify(errors));
        } else {
            callback(email,repo, simpleWriteResponse(res));
        }
    });
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

exports.createSubscription = function(req, res) {
    sanitize(req, res, function(email, repourl, callback) {
        var user = github.getUserFromUrl(repourl);
        var repo = github.getRepoFromUrl(repourl);

        if (!user || !repo) {
            res.send(404, 'Invalid URL. It should look like this: "https://github.com/seriema/npmalerts.git".');
            return;
        }

        github.getPackageJson(user, repo, function(error, json) {
            if (error) {
                res.send(500, 'Error connecting to Github. You have not been added to the watchlist. (' + error + ')');
                return;
            }

            if (!json.dependencies && !json.devDependencies) {
                res.send(404, 'No packages defined in package.json. You have not been added to the watchlist.');
                return;
            }

            db.createSubscription(email, repo, callback);
        });
    });
};

exports.readSubscriptions = function(req, res) {
    db.readSubscriptions(simpleReadResponse(res));
};

exports.deleteSubscription = function(req, res) {
    sanitize(req, res, db.deleteSubscription);
};

exports.readPackages = function(req, res) {
    db.readPackages(simpleReadResponse(res));
};