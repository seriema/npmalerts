var GitHubApi = require('github');
var githubapi = new GitHubApi({
	// required
	version: "3.0.0",
	// optional
	timeout: 3000
});

var githubRegex = new RegExp('github.com/([^/]+)/(.*?)(\\.git)?$');


exports.getPackageJson = function (user, repo, callback) {
	var options = {
		user: user,
		repo: repo,
		path: 'package.json'
	};

	githubapi.repos.getContent(options, function(error, result) {
		if (error) {
			callback(error.message || error.defaultMessage || error);
			return;
		}

		var jsonString = new Buffer(result.content, result.encoding).toString();
		var json = JSON.parse(jsonString);
		callback(null, json);
	});
};

exports.getUserFromUrl = function(url) {
    var match = url && url.match(githubRegex);
    return match && match.length > 1 && match[1];
};

exports.getRepoFromUrl = function(url) {
    var match = url && url.match(githubRegex);
    return match && match.length > 2 && match[2];
};
