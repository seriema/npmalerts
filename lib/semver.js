var semver = require('semver');

var regex = new RegExp('(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][a-zA-Z0-9-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][a-zA-Z0-9-]*))*))?(?:\\+([0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*))?');
function strip(range) {
	return regex.exec(range)[0];
}

exports.isNew = function isNew(version, range) {
	return (semver.satisfies(version, range) && semver.gt(version, strip(range))) || semver.gtr(version, range);
};