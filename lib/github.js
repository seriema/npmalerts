'use strict';

var GitHubApi = require('github');
var githubapi = new GitHubApi({
	// required
	version: "3.0.0",
	// optional
	timeout: 5000
});

exports.getPackageJson = function (user, repo, callback) {
	githubapi.repos.getContent({
		user: user,
		repo: repo,
		path: 'package.json'
	}, function(error, result) {
		if (error) {
			callback(error);
			return;
		}

		var jsonString = new Buffer(result.content, result.encoding).toString();
		var json = JSON.parse(jsonString);
		callback(null, json);
	});
};