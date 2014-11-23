// Made by Tim Caswell, https://gist.github.com/creationix/bb1474fd018076862c6b
module.exports = asyncMap;

// This will loop through an array calling fn(item, callback) for each item.
// It assumes that the callback will always be called eventually with (err) or (null, value)
// Once all the callbacks have been called, the outer callback will be called with (error, results)
// where `error` is the last error to occur (if any)
// and `results` is the mapped results of the initial array.
function asyncMap(array, fn, callback) {
  var left = array.length;
  var results = new Array(left);
  var error;
  // Handle case of empty array
  if (!left) return callback(error, results);
  // Run all commands in parallel and wait for results.
  array.forEach(function (item, i) {
    fn(item, function (err, result) {
      if (err) error = err;
      else results[i] = result;
      if (!--left) callback(error, results);
    });
  });
}

/*
// Usage example and test, not part of library
asyncMap([1,2,3,4,5], function (num, callback) {
  setTimeout(function () {
    callback(null, num);
  }, Math.random() * 100);
}, function (err, results) {
  if (err) throw err;
  console.log(results);
});
*/