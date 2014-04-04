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
    case 0: return;
    case 1: onePackageUpdated(email, repourl, packages, callback); break;
    default: severalPackagesUpdated(email, repourl, packages, callback);
  }
};

function onePackageUpdated(email, repourl, packages, callback) {
  var options = {
    to: email,
    from: defaults.from,
    fromname: defaults.fromname,
    subject: 'New package available',
    text: ''
  };

  options.text = 'Hello!\n\nA package your project ' + repourl + ' depends on has been updated.\n';

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
    subject: 'New packages available',
    text: ''
  };

  options.text = 'Hello!\n\nThere are some updated packages your project ' + repourl + ' depends on.\n';

  function addNotificationsFor(deps) {
    return function (name) {
      var pack = deps[name];
      options.text += name + ': ' + pack.current + ' (' + pack.old + ')\n';
    };
  }

  if (Object.keys(packages.dependencies).length) {
    options.text += 'Dependencies:\n';
    Object.keys(packages.dependencies).forEach(addNotificationsFor(packages.dependencies));
    options.text += '\n';
  }

  if (Object.keys(packages.devDependencies).length) {
    options.text += 'Dev dependencies:\n';
    Object.keys(packages.devDependencies).forEach(addNotificationsFor(packages.devDependencies));
    options.text += '\n';
  }

  options.text += 'Happy hacking!\n\n/npmalerts.com\n\nDon\'t want these emails? Unsubscribe: http://npmalerts.com/#/?repo=' + repourl + '&email=' + email;

  sendgrid.send(options, function(error) {
    if (error) return callback('SendGrid: ' + error);

    console.log('Sent email to ' + email + ' about ' + repourl + ' concerning one package.');
    callback();
  });
}
