var sendgrid  = require('sendgrid')(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

var defaults = {
  from: 'seriema+npmalerts@gmail.com',
  fromname: 'npm alerts'
};

exports.send = function(email, repourl, packages, callback) {
  var packagesUpdated = Object.keys(packages.dependencies).length + Object.keys(packages.devDependencies).length;

  switch (packagesUpdated) {
    case 0: return callback();
    case 1: onePackageUpdated(email, repourl, packages, callback); break;
    default: severalPackagesUpdated(email, repourl, packages, callback);
  }
};

function onePackageUpdated(email, repourl, packages, callback) {
  var options = {
    to: email,
    from: defaults.from,
    fromname: defaults.fromname,
    subject: 'Dependency update available for ' + repourl,
    text: ''
  };

  options.text = 'Hello!\n\nYour project ' + repourl + ' has a dependency that has a new version.\n\n';

  function addNotificationFor(deps) {
    var name = Object.keys(deps)[0];
    var pack = deps[name];
    options.text += name + ': ' + pack.current + ' (' + pack.old + ')\n\n';
  }

  if (Object.keys(packages.dependencies).length) {
    options.text += 'Dependency:\n';
    addNotificationFor(packages.dependencies);
  }

  if (Object.keys(packages.devDependencies).length) {
    options.text += 'Dev dependency:\n';
    addNotificationFor(packages.devDependencies);
  }

  options.text += 'Happy hacking!\n/npmalerts.com\n\nDon\'t want these emails? Unsubscribe: http://npmalerts.com/#/?repo=' + repourl + '&email=' + email;

  sendgrid.send(options, function(error) {
    if (error) return callback('SendGrid: ' + error);

    console.log('Sent email to ' + email + ' about ' + repourl + ' concerning one package.');
    callback();
  });
}

function severalPackagesUpdated(email, repourl, packages, callback) {
  var options = {
    to: email,
    from: defaults.from,
    fromname: defaults.fromname,
    subject: 'Dependency updates available for ' + repourl,
    text: ''
  };

  options.text = 'Hello!\n\nYour project ' + repourl + ' has dependencies that have new versions.\n\n';

  var numPackages = 0;

  function addNotificationsFor(deps, title)
  {
    if (!Object.keys(deps).length)
      return;

    options.text += title + ':\n';
    Object.keys(deps).forEach(function (name) {
      var pack = deps[name];
      options.text += name + ': ' + pack.current + ' (' + pack.old + ')\n';
      numPackages++;
    });
    options.text += '\n';
  }

  addNotificationsFor(packages.dependencies, 'Dependencies');
  addNotificationsFor(packages.devDependencies, 'Dev dependencies');

  options.text += 'Happy hacking!\n\n/npmalerts.com\n\nDon\'t want these emails? Unsubscribe: http://npmalerts.com/#/?repo=' + repourl + '&email=' + email;

  (function(packagesCurry) {
    sendgrid.send(options, function(error) {
      if (error) return callback('SendGrid: ' + error);

      console.log('Sent email to ' + email + ' about ' + repourl + ' concerning ' + packagesCurry + ' packages.');
      callback();
    });
  }(numPackages));
}
