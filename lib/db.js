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

// Subscriptions

exports.createSubscription = function(email, repo, callback) {
    executeQuery("INSERT INTO subscriptions VALUES ('" + email + "','" + repo + "')", callback);
};

exports.readSubscriptions = function(callback) {
    executeQuery('SELECT * FROM subscriptions', callback);
};

exports.deleteSubscription = function(email, repo, callback) {
    executeQuery("DELETE FROM subscriptions WHERE email='" + email + "' AND repourl='" + repo + "'", callback);
};

// Packages

exports.createPackage = function(name, version, updated, callback) {
    executeQuery("INSERT INTO packages VALUES ('" + name + "','" + version + "','" + updated+ "')", callback);
};

exports.getPackageByName = function(name, callback) {
    executeQuery("SELECT * FROM packages WHERE name='" + name + "'", callback);
};

exports.updatePackageByName = function(name, version, updated, callback) {
    executeQuery("UPDATE packages SET name='" + name + "',version='" + version + "',updated='" + updated + "' WHERE name='" + name + "'", callback);
};
