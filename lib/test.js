var npm = require('npm');

npm.load({});

npm.registry.get('uubench', function (err, data) {
  console.log(data);
});
