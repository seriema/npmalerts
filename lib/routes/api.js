var db = require('../db.js');


function sanitize(req) {
    req.assert('email', 'Invalid email'.).isEmail();
    req.assert('repo', 'Invalid URL.').isUrl();

    return req.validationErrors();
}


exports.createSubscription = function(req, res) {
    var errors = sanitize(req);
    if (errors) {
        res.send(400, JSON.stringify(errors));
    } else {
        var email = req.param('email');
        var repo = req.param('repo');
        db.createSubscription(email, repo, function(error) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(200);
            }
        });
    }
};

exports.readSubscriptions = function(req, res) {
    db.readSubscriptions(function(error, result) {
        if (error) {
            res.send(500, error);
        } else {
            res.send(200, JSON.stringify(result));
        }
    });
};

exports.deleteSubscription = function(req, res) {
    var errors = sanitize(req);
    if (errors) {
        res.send(400, JSON.stringify(errors));
    } else {
        var email = req.param('email');
        var repo = req.param('repo');
        db.deleteSubscription(email, repo, function(error) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(200);
            }
        });
    }
};

exports.readPackages = function(req, res) {
    db.readPackages(function(error, result) {
        if (error) {
            res.send(500, error);
        } else {
            res.send(200, result);
        }
    });
};