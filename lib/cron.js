var http = require('http');

http.get('/api/cron', function() {
    console.log('Cron job started');
});