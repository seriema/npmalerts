var pg = require('pg');


function executeQuery(query, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            res.send(500, err);
            return;
        }

        client.query(query, function(error, result) {
            if (error) {
                res.send(500, {query: query, error: error});
            } else {
                res.send(result);
            }
        });
    });
}

function sanitized(req) {
    req.assert('email', 'Invalid email').isEmail();
    req.assert('repo', 'Invalid URL').isUrl();

    var errors = req.validationErrors();
    if (errors) {
        res.send(400, 'There have been validation errors: ' + JSON.stringify(errors));
        return false;
    }

    return true;
}


exports.createSubscription = function(req, res) {
    if (sanitized(req)) {
        var email = req.param('email');
        var repo = req.param('repo');
        executeQuery("INSERT INTO subscriptions VALUES ('" + email + "','" + repo + "')", res);
    }
};

exports.readSubscriptions = function(req, res) {
    executeQuery('SELECT * FROM subscriptions', res);
};

exports.deleteSubscription = function(req, res) {
    if (sanitized(req)) {
        var email = req.param('email');
        var repo = req.param('repo');
        executeQuery("DELETE FROM subscriptions WHERE email='" + email + "' AND repourl='" + repo + "'", res);
    }
};

exports.readPackages = function(req, res) {
    executeQuery('SELECT * FROM packages', res);
};