var sendgrid  = require('sendgrid')(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);


exports.send = function(email, repourl, packages) {
  var options = {
    to: email,
    from: 'seriema+npmalerts@gmail.com',
    fromname: 'npm alerts',
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
  }

  if (Object.keys(packages.devDependencies).length) {
    options.text += 'Dev dependencies:\n';
    Object.keys(packages.devDependencies).forEach(addNotificationsFor(packages.devDependencies));
  }

  options.text += '\nHappy hacking!\n\n/npmalerts.com\n\nDon\'t want these emails? Unsubscribe: http://npmalerts.com/#/?repo=' + repourl + '&email=' + email;
//  console.log(options);

  sendgrid.send(options, function(error) {
    if (error) {
      return console.error(error);
    }
  });
};
