var pg = require('pg');


exports.createSubscription = function(req, res) {
    res.send(JSON.stringify(req));
/*
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            data = err;
            return;
        }

        client.query("INSERT INTO subscriptions", function(error, result) {
            res.send(JSON.stringify(result.rows));
        });
    });
*/
};

exports.readSubscriptions = function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            res.send(err);
            return;
        }

        client.query("SELECT * FROM subscriptions", function(error, result) {
            if (error) {
                res.send(error);
            } else {
                res.send(JSON.stringify(result.rows));
            }
        });
    });
};

exports.deleteSubscription = function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            res.send(err);
            return;
        }

        client.query('DELETE * FROM subscriptions WHERE email LIKE ' + req.param.email + ' AND repourl LIKE ' + req.param.repo, function(error, result) {
            if (error) {
                res.send(error);
            } else {
                res.send(JSON.stringify(result.rows));
            }
        });
    });
};

exports.readPackages = function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            res.send(err);
            return;
        }

        client.query("SELECT * FROM packages", function(error, result) {
            if (error) {
                res.send(error);
            } else {
                res.send(JSON.stringify(result.rows));
            }
        });
    });
};