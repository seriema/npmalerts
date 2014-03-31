var GitHubApi = require('github');
var githubapi = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  timeout: 3000
});

// Use a github token if one is available.
// This increases the rate-limit for looking up package.json files.
if (process.env.GITHUB_TOKEN) {
  githubapi.authenticate({
    type: "oauth",
    token: process.env.GITHUB_TOKEN
  });
}

var githubRegex = new RegExp('github.com/([^/]+)/(.*?)(\\.git)?$');


exports.getPackageJson = function (user, repo, callback) {
  var options = {
    user: user,
    repo: repo,
    path: 'package.json'
  };

  githubapi.repos.getContent(options, function(error, result) {
    if (error) {
      // Make sure the error is an Error instance
      error = error.message || error.defaultMessage || error;
      if (!(error instanceof Error)) {
        error = new Error(error);
      }
      callback(error);
      return;
    }
    // Watch for exceptions in processing the result.
    var json;
    try {
      var jsonString = new Buffer(result.content, result.encoding).toString();
      json = JSON.parse(jsonString);
    }
    catch (err) {
      callback(err);
      return;
    }
    callback(null, json);
  });
};

exports.getUrlFromUserWithRepo = function(userAndRepo) {
  return 'https://github.com/' + userAndRepo;
};

exports.getUserFromUrl = function(url) {
  var match = url && url.match(githubRegex);
  return match && match.length > 1 && match[1];
};

exports.getRepoFromUrl = function(url) {
  var match = url && url.match(githubRegex);
  return match && match.length > 2 && match[2];
};
