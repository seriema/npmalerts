var db = require('../db.js');


function checkParams(req, callback) {
    req.assert('email', 'Invalid email.').isEmail();
    req.assert('repo', 'Invalid URL.').isUrl();

    var errors = req.validationErrors();
    if (errors) {
        callback(errors);
    } else {
        callback(null, req.params('email'), req.params('repo'));
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
    sanitize(req, res, db.createSubscription);
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