const userService = require('services/userService');

async function hydrateUserAuth(req, res, next) {
	const userOAuth = await userService.getOAuthData({teamId: req.body.team_id});
	req.userOAuth = userOAuth;
	next();
}

exports = module.exports = hydrateUserAuth;