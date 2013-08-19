var db = require('../db.js');


function sanitize(req, callback) {
    req.assert('email', 'Invalid email.').isEmail();
    req.assert('repo', 'Invalid URL.').isUrl();

    var errors = req.validationErrors();
    if (errors) {
        callback(errors);
    } else {
        callback(null, req.params('email'), req.params('repo'));
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

function simpleReadResponse(res) {
    return function(error) {
        if (error) {
            res.send(500, error);
        } else {
            res.send(200);
        }
    };
}

exports.createSubscription = function(req, res) {
    sanitize(req, function(errors, email, repo) {
        if (errors) {
            res.send(400, JSON.stringify(errors));
        } else {
            db.createSubscription(email, repo, simpleWriteResponse(res));
        }
    });
};

exports.readSubscriptions = function(req, res) {
    db.readSubscriptions(simpleReadResponse(res));
};

exports.deleteSubscription = function(req, res) {
    sanitize(req, function(errors, email, repo) {
        if (errors) {
            res.send(400, JSON.stringify(errors));
        } else {
            db.deleteSubscription(email, repo, simpleWriteResponse(res));
        }
    });
};

exports.readPackages = function(req, res) {
    db.readPackages(simpleReadResponse(res));
};