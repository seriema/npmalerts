var semver = require('semver');

var regex = new RegExp('(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][a-zA-Z0-9-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][a-zA-Z0-9-]*))*))?(?:\\+([0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*))?');
function strip(range) {
  var data = regex.exec(range);
  if (!data || data.length === 0) {
    console.error('Could not parse invalid range: ' + range);
    return null;
  }

  return data[0];
}

exports.isNew = function isNew(version, range) {
  var clean = strip(range);
  if (!clean) {
    return false;
  }

  return (semver.satisfies(version, range) && semver.gt(version, clean)) || semver.gtr(version, range);
};