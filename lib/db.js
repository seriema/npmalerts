var connectionString = process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

var mongoose = require('mongoose');
mongoose.connect(connectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error: '));


// Subscriptions

function validateEmail() {
  return true;
}

function validateUrl() {
  return true;
}

var subscriberSchema = mongoose.Schema({
  email: { type: String, validate: validateEmail },
  repourl: { type: String, validate: validateUrl },
  ignorePatch: Boolean
});
var Subscriber = mongoose.model('Subscriber', subscriberSchema);


exports.createSubscription = function(email, repourl, ignorePatch, callback) {
  var newSubscriber = new Subscriber({ email: email, repourl: repourl, ignorePatch: ignorePatch });
  newSubscriber.save(function (error) {
    if (error) {
      return callback('Error saving subscriber to db. ' + error);
    }

    callback(null);
  });
};

exports.findSubscription = function(email, repourl, callback) {
  Subscriber.find({ email: email, repourl: repourl }, function (error, subscribers) {
    if (error) {
      return callback('Error searching subscriptions ' + error);
    }

    callback(null, subscribers);
  });
};

exports.readSubscriptions = function(callback) {
  Subscriber.find(function (error, subscribers) {
    if (error) {
      return callback('Error reading subscriptions ' + error);
    }

    callback(null, subscribers);
  });
};

exports.deleteSubscription = function(email, repo, callback) {
  var target = { email: email, repourl: repo };
  Subscriber.find(target, function (error, subscribers) {
    if (error) {
      return callback(error);
    }

    if (subscribers.length === 0) {
      return callback('Sorry, couldn\'t find that email and repository combination. If you\'ve received an alert email previously then check the unsubscribe link at the bottom.');
    }

    Subscriber.remove(target, function(error) {
      if (error) {
        return callback(error);
      }

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
    if (error) {
      return callback(error);
    }

    if (updates.length === 0) {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var update = new Update({ timestamp: yesterday });
      update.save(function (error) {
        if (error) {
          return callback('Error saving new timestamp to db. ' + error);
        }
      });
      updates.push(update);
    }

    callback(null, updates[0].timestamp);
  });
};

exports.setUpdate = function(oldTimestamp, newTimestamp, callback) {
  Update.update({ timestamp: oldTimestamp }, { timestamp: newTimestamp }, callback);
};
