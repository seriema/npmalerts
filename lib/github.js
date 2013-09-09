'use strict';

var GitHubApi = require('github');
var githubapi = new GitHubApi({
	// required
	version: "3.0.0",
	// optional
	timeout: 3000
});

exports.getPackageJson = function (user, repo, callback) {
	githubapi.repos.getContent({
		user: user,
		repo: repo,
		path: 'package.json'
	}, function(error, result) {
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
    var user = url.substr('https://github.com/'.length);
    user = user.substr(0, user.indexOf('/'));
    return user;
};

exports.getRepoFromUrl = function(url) {
    var repo = url.substr(url.lastIndexOf('/')+1);
    repo = repo.substr(0, repo.indexOf('.'));
    return repo;
}
