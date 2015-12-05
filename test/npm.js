var npmMock = require('npm-registry-mock');
var npmWrapper = require('../lib/npm.js');

var mockUrl = 'http://localhost:1331/';
var mockOptions = { port: 1331 };

exports['npm'] = {
  'get all packages from npm': function(test) {
    test.expect(3);
    npmMock(mockOptions, function (err, s) {
      test.ok(!err);
      npmWrapper.getLatestVersions(["underscore", "request"], function (error, versions) {
        test.ok(!error);
        test.ok(versions);
        test.done();
        s.close();
      }, mockUrl);
    });
  }
};
