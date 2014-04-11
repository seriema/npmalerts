var asyncMap = require('./async-map');

var semver = require('./semver');
var github = require('./github');
var npmWrapper = require('./npm');
var db = require('./db');
var emailWrapper = require('./email');


var running = false;

exports.start = function() {
  // Only allow one instance to run at a time
  if (running) {
    console.log("Check already running.");
    return false;
  }
  console.log("Starting check.");
  running = true;
  var retriesLeft = 2;
  checkUpdates(onDone);
  return true;

  function onDone(error) {
    if (error) {
      console.error(error);
      if (retriesLeft--) {
        return checkUpdates(onDone);
      }
      running = false;
      console.log("Giving up!");
    }
    else {
      running = false;
      console.log("Check finished.");
    }
  }
};

function checkUpdates(callback) {

  // Mapping of unique email address to list of packages
  var emails = {};

  // List of packages to monitor, indexed by user/name string
  // Each entry contains:
  //   dependencies - a map of dependency name to version
  //   devDependencies - a map of dev dependency name to version
  var packages = {};

  // This is a mapping of dependency name to dependent package
  // key is dependency name, value is direct reference to entry in packages hash
  var dependents = {};

  // First we need to load all the subscriptions
  db.readSubscriptions(onSubscriptions);

  function onSubscriptions(error, subscriptions) {
    if (error) return callback(error);

    asyncMap(subscriptions, function (subscription, callback) {
      var user = github.getUserFromUrl(subscription.repourl);
      var repo = github.getRepoFromUrl(subscription.repourl);
      var key = user + "/" + repo;

      // Record this email/package combo
      var watching = emails[subscription.email];
      if (watching) watching.push(key);
      else emails[subscription.email] = [key];

      if (packages[key]) {
        // Someone else is already watching for changes in this project
        return;
      }

      packages[key] = {};

      github.getPackageJson(user, repo, function (error, meta) {
        if (error) return callback(error);
        if (meta.dependencies) {
          packages[key].dependencies = meta.dependencies;
          Object.keys(meta.dependencies).forEach(addLink);
        }
        if (meta.devDependencies) {
          packages[key].devDependencies = meta.devDependencies;
          Object.keys(meta.devDependencies).forEach(addLink);
        }
        callback();
      });

      function addLink(name) {
        if (dependents[name]) dependents[name].push(key);
        else dependents[name] = [key];
      }

    }, onProcessed);
  }


  function onProcessed(error) {
    if (error) return callback(error);
    console.log("Checking %s unique packages with %s total unique dependencies for %s unique email addresses.",
                Object.keys(packages).length,
                Object.keys(dependents).length,
                Object.keys(emails).length);
    npmWrapper.getLatestVersions(Object.keys(dependents), onVersions);
  }

  function onVersions(error, versions) {
    if (error) return callback(error);

    console.info({
      emails: emails,
      dependents: dependents,
      packages: packages,
      versions: versions
    });

    // We now have emails of all the people interested in updates.
    // We also have the list of subscriptions grouped by user/name projects key.
    // We also have the latest version of any npm package that we care about.
    // We also have the dependencies and devDependencies of all subscribed packages.

    // Now the task is to loop through the packages, find dependencies and
    // devDependencies that are out of date.  Record a list of packages with
    // out of data deps.
    var newPackages = {};
    var yesterday = new Date();
    yesterday.setHours(-25);
    Object.keys(packages).forEach(findDependencies);
    var newDependenciesCount = 0;

    function findDependencies(repo) {
      if (!newPackages[repo])
        newPackages[repo] = {};
      newPackages[repo].dependencies = {};
      newPackages[repo].devDependencies = {};

      if (packages[repo].dependencies)
        Object.keys(packages[repo].dependencies).forEach(checkDepVersionFor(packages[repo].dependencies, newPackages[repo].dependencies));
      if (packages[repo].devDependencies)
        Object.keys(packages[repo].devDependencies).forEach(checkDepVersionFor(packages[repo].devDependencies, newPackages[repo].devDependencies));

      function checkDepVersionFor(dep, result) {
        return function (package) {
          if (versions[package].updated >= yesterday && semver.isNew(versions[package].latest, dep[package])) {
            result[package] = { old: dep[package], current: versions[package].latest };
            newDependenciesCount++;
          }
        };
      }
    }

    console.info('There are %s new dependencies.', newDependenciesCount);

    // Then loop through the email address and for each one, loop through it's
    // packages.  If any of them had out-of-date deps, prepare and send an email.
    // If sending an email is an async operation, you can do it in an asyncMap
    // so that you can catch errors and be notified when they are all done.
    asyncMap(emails, processEmail, onProcessedEmails);

    function processEmail(email, callback) {
      if (error) return callback(error);

      Object.keys(email).forEach(sendEmail);

      function sendEmail(key) {
        emails[key].forEach(function (repo) {
          var newPacks = newPackages[repo];
          var numNewPacks = Object.keys(newPacks.dependencies).length + Object.keys(newPacks.devDependencies).length;
          if (numNewPacks === 0)
            return callback();

          var repourl = github.getUrlFromUserWithRepo(repo);
          console.info('Sending email to ' + key + ' for ' + repourl + ' about ' + numNewPacks + ' packages.');
          emailWrapper.send(key, repourl, newPacks, callback);
        });
      }
    }

    function onProcessedEmails(error) {
      // Once done, call the outer `callback` to release the global lock and let
      // the server log that the action is complete.
      callback(error);
    }
  }

}
