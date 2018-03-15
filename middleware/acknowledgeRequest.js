const config = require('config');

function acknowledgeRequest(req, res, next) {
	if (req.body.challenge) {
		return res.json(req.body.challenge);
	}

	if (req.body.token !== config.slack.verificationToken) {
		return res.sendStatus(401);
	}

	if (req.body.event.subtype === "bot_message") {
		return res.sendStatus(200);
	}

	res.sendStatus(200);
	next();
}

module.exports = exports = acknowledgeRequest
