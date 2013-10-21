var sendgrid  = require('sendgrid')(
	process.env.SENDGRID_USERNAME,
	process.env.SENDGRID_PASSWORD
);

exports.send = function(email, repourl, packageName, currentVersion, latestVersion) {
	var options = {
		to: email,
		from: 'noreply@npmalerts.com',
		fromname: 'NPM Alerts',
		subject: packageName + ' has been updated to ' + latestVersion,
		text: 'Hello!\n\nIn your project ' + repourl + ' you use the node.js package ' + packageName + ' and it has released ' + latestVersion + ' (you use ' + currentVersion + ')!\n\n/npmalerts.com'
	};

	sendgrid.send(options, function(err) {
		if (err) {
			return console.error(err);
		}
	});
};