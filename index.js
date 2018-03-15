const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('routes');
const logger = require('logger');
const mongo = require('common/db').connection;

hasRequiredEnvVariables();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

routes.register(app);

mongo.once('open', function () {
	app.listen(config.app.port, function () {
		logger.info("KnockKnock Bot listening on " + config.app.port);
	});
});

function hasRequiredEnvVariables() {
	const required = [
		"app.port",
		"slack.clientId",
		"slack.clientSecret",
	];

	required.forEach(key => {
		if (config.get(key) == null) {
			logger.error(`${key} was null`);
			process.exit(1);
		}
	});
}