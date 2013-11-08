'use strict';

var GitHubApi = require('github');
var githubapi = new GitHubApi({
	// required
	version: "3.0.0",
	// optional
	timeout: 3000
});

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
//	var user = url && url.substr('https://github.com/'.length);
//	return user && user.substr(0, user.indexOf('/'));
    var regex = new RegExp('github.com/([^/]+)/(.*?)(\\.git)?$');
    return url && url.match(regex)[1];
};

exports.getRepoFromUrl = function(url) {
    var regex = new RegExp('github.com/([^/]+)/(.*?)(\\.git)?$');
    return url && url.match(regex)[2];
};
