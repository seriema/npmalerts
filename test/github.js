var githubWrapper = require('../lib/github.js');

var _ = require('lodash');

var sampleGithubUrls = [
  'http://github.com/seriema/seriema.github.io.git',
  'https://github.com/seriema/seriema.github.io.git',
  'http://github.com/seriema/seriema.github.io',
  'https://github.com/seriema/seriema.github.io',
  'http://www.github.com/seriema/seriema.github.io',
  'https://www.github.com/seriema/seriema.github.io',
  'git://github.com/seriema/seriema.github.io.git'
];

exports['github'] = {
  'fail to get package.json in Github repo': function(test) {
    test.expect(1);
    githubWrapper.getPackageJson('fake', 'foo', function(error) {
      test.ok(!!error, error && error.message);
      test.done();
    });
  },
  'get package.json in Github repo': function(test) {
    test.expect(1);
    githubWrapper.getPackageJson('seriema', 'npmalerts', function(error) {
      test.ok(!error, error && error.message);
      test.done();
    });
  },
  'read package.json in Github repo': function(test) {
    test.expect(2);
    githubWrapper.getPackageJson('seriema', 'npmalerts', function(error, json) {
      test.notEqual(json, undefined);
      test.strictEqual(typeof json, 'object');
      test.done();
    });
  },
  'parse username from Github address': function(test) {
    test.expect(sampleGithubUrls.length);
    _.forEach(sampleGithubUrls, function(address) {
      test.strictEqual(githubWrapper.getUserFromUrl(address), 'seriema', address);
    });
    test.done();
  },
  'parse project name from Github adress': function(test) {
    test.expect(sampleGithubUrls.length);
    _.forEach(sampleGithubUrls, function(address) {
      test.strictEqual(githubWrapper.getRepoFromUrl(address), 'seriema.github.io', address);
    });
    test.done();
  }
};
