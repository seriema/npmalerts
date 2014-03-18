var npmMock = require('npm-registry-mock');
var npmWrapper = require('../lib/npm.js');

var loadOptions = { registry: "http://localhost:1331" };
var mockOptions = { port: 1331 };

exports['npm'] = {
  /*
  'get latest package version': function(test) {
    test.expect(2);
    npmMock(mockOptions, function (s) {
      npmWrapper.getLatestVersion('underscore', function(error, version) {
        test.ok(!error);
        test.ok(version);
        test.done();
        s.close();
      }, loadOptions);
    });
  },*/

  'get all packages from npm': function(test) {
    test.expect(3);
    npmMock(mockOptions, function (s) {
      npmWrapper.load(loadOptions, function (error) {
        test.ok(!error);
        npmWrapper.getLatestVersions(["underscore", "request"], function (error, versions) {
          test.ok(!error);
          test.ok(versions);
          test.done();
          s.close();
        });
      });
    });
  }
};
