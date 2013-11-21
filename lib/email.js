var sendgrid  = require('sendgrid')(
	process.env.SENDGRID_USERNAME,
	process.env.SENDGRID_PASSWORD
);

exports.send = function(email, repourl, packageName, currentVersion, latestVersion) {
	var options = {
		to: email,
		from: 'seriema+npmalerts@gmail.com',
		fromname: 'npm alerts',
		subject: packageName + ' has been updated to ' + latestVersion,
		text: 'Hello!\n\nIn your project ' + repourl + ' you use the node.js package ' + packageName + ' and it has released ' + latestVersion + ' (you use ' + currentVersion + ')!\n\nHappy hacking!\n\n/npmalerts.com\n\nDon\'t want these emails? Unsubscribe: http://npmalerts.com/#/?repo=' + repourl + '&email=' + email
	};

	sendgrid.send(options, function(error) {
		if (error) {
			return console.error(error);
		}
	});
};