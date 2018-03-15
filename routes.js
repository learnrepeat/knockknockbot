const acknowledgeRequest = require('middleware/acknowledgeRequest');
const hydrateOAuth = require('middleware/hydrateOAuth');
const userHandler = require('handlers/userHandler');
const eventsHandler = require('handlers/eventsHandler');

function register(app) {
	app.get('/', function(req, res) {
		res.render('index')
	});

	app.get('/oauth', userHandler.oAuth);
	app.post('/events/receive', acknowledgeRequest, hydrateOAuth, eventsHandler.receiveEvents);
}

exports = module.exports = {
	register: register
}