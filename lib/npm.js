var RegClient = require('silent-npm-registry-client');
var client = new RegClient({});
var registryUrl = 'https://registry.npmjs.org/';
var npmConfig = { timeout: 1000 };
var asyncMap = require('./async-map');

exports.getLatestVersions = getLatestVersions;
// Query npm for the latest versions of a list of packages
// This API internally fetches the latest changes from npm automatically
// so we don't have to worry about timestamps or cache invalidation.
//
// `names` is an array of npm package names
function getLatestVersions(names, callback, registryUrlOverride) {
  registryUrl = registryUrlOverride || registryUrl;

  // Fetch the meta.dist-tags.latest value for all the packages in parallel
  asyncMap(names, function (name, callback) {
    client.get(registryUrl + name, npmConfig, function (err, data) {
      if (err) {
        callback(err);
        return;
      }

      var latest = data['dist-tags'].latest;
      var updated;
      if (data.time)
         updated = new Date(data.time[latest]);
      else {
        console.error('Package ' + name + ' is missing a time object. Continuing by assuming an old date.'); // This has actually happened in production.
        updated = new Date();
        updated.setHours(-25);
      }

      callback(null, { latest: latest, updated: updated, isPatch: isPatch(latest) });
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

function isPatch(version) {
  var regex = new RegExp('[0-9]+.[0-9]+.([0-9]+)');
  return version.match(regex)[1] !== '0';
}
