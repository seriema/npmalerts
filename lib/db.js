var connectionString = process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

var mongoose = require('mongoose');
mongoose.connect(connectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));


// Subscriptions

function validateEmail(email) {
    return true;
}

function validateUrl(url) {
    return true;
}

var subscriberSchema = mongoose.Schema({
    email: { type: String, validate: validateEmail },
    repo: { type: String, validate: validateUrl }
});
var Subscriber = mongoose.model('Subscriber', subscriberSchema);


exports.createSubscription = function(email, repo, callback) {
    var newSubscriber = new Subscriber({ email: email, repo: repo });
    newSubscriber.save(function (error) {
        if (error)
            return callback('Error saving subscriber to db. ' + error);

        callback(null);
    });
};

exports.readSubscriptions = function(callback) {
    Subscriber.find(function (error, subscribers) {
        if (error)
            callback('Error reading subscriptions ' + error);

        callback(null, subscribers);
    });
};

exports.deleteSubscription = function(email, repo, callback) {
    var target = { email: email, repo: repo };
    Subscriber.find(target, function (error, subscribers) {
        if (error)
            return callback(error);

        if (subscribers.length === 0)
            return callback('Subscriber not found in db.');

        Subscriber.remove(target, function(error) {
            if (error)
                return callback(error);

            callback(null);
        });
    });
};


// Updates

var updateSchema = mongoose.Schema({
    timestamp: Date
});
var Update = mongoose.model('Update', updateSchema);

exports.getUpdate = function(callback) {
  Update.find(function (error, updates) {
      if (error)
        return callback(error);

      if (updates.length === 0) {
          var yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          var update = new Update({ timestamp: yesterday });
          update.save(function (error) {
              if (error)
                  return callback('Error saving new timestamp to db. ' + error);
          });
          updates.push(update);
      }

      callback(null, updates[0].timestamp);
  });
};

exports.setUpdate = function(oldTimestamp, newTimestamp, callback) {
    Update.update({ timestamp: oldTimestamp }, { timestamp: newTimestamp }, callback);
};