var pg = require('pg');


function executeQuery(query, callback) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        if (err) {
            callback('Could not connect to db.');
            return;
        }

        client.query(query, function(error, result) {
            if (error) {
                callback('Error executing query.');
            } else {
                callback(null, result.rows);
            }
        });
    });
}

exports.createSubscription = function(email, repo, callback) {
    executeQuery("INSERT INTO subscriptions VALUES ('" + email + "','" + repo + "')", callback);
};

exports.readSubscriptions = function(callback) {
    executeQuery('SELECT * FROM subscriptions', callback);
};

exports.deleteSubscription = function(email, repo, callback) {
    executeQuery("DELETE FROM subscriptions WHERE email='" + email + "' AND repourl='" + repo + "'", callback);
};

exports.readPackages = function(callback) {
    executeQuery('SELECT * FROM packages', callback);
};