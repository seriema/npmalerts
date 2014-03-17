var npm = require('npm');
var asyncMap = require('slide').asyncMap;

exports.getLatestVersions = getLatestVersions;
// Query npm for the latest versions of a list of packages
// This API internally fetches the latest changes from npm automatically
// so we don't have to worry about timestamps or cache invalidation.
//
// `names` is an array of npm package names
function getLatestVersions(names, callback) {
  // Fetch the meta.dist-tags.latest value for all the packages in parallel
  asyncMap(names, function (name, callback) {
    npm.registry.get(name, function (err, data) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, data['dist-tags'].latest);
    });
  }, function (error, versions) {
    if (error) {
      callback(error);
      return;
    }

    // When done combine the two arrays into an object for easy lookup.
    var latest = {};
    names.forEach(function (name, i) {
      latest[name] = versions[i];
    });

    callback(null, latest);
  });
}


// Export load
exports.load = npm.load;
