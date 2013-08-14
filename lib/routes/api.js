var pg = require('pg');


function executeQuery(query, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            res.send(500, err);
            return;
        }

        client.query(query, function(error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(JSON.stringify(result));
            }
        });
    });
}


exports.createSubscription = function(req, res) {
    executeQuery('INSERT INTO subscriptions values('+req.body.email+','+req.body.repourl+')', res);
};

exports.readSubscriptions = function(req, res) {
    executeQuery('SELECT * FROM subscriptions', res);
};

exports.deleteSubscription = function(req, res) {
    executeQuery('DELETE FROM subscriptions WHERE email=' + req.params.email + ' AND repourl=' + req.params.repo, res);
};

exports.readPackages = function(req, res) {
    executeQuery('SELECT * FROM packages', res);
};