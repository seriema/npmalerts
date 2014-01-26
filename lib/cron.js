var http = require('http');

http.get('http://npmalerts.herokuapp.com/api/cron', function() {
    console.log('Cron job started');
});