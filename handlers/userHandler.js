const config = require('config');
const request = require('request');
const { WebClient } = require('@slack/client');

const userService = require('services/userService');

function oAuth(req, res, next) {
	if (!req.query.code) {
		console.log("Looks like we're not getting code.");
		return res.status(500).send({"Error": "Looks like we're not getting code."});
	} else {
		request({
			url: 'https://slack.com/api/oauth.access',
			qs: {code: req.query.code, client_id: config.slack.clientId, client_secret: config.slack.clientSecret},
			method: 'GET',
		}, async function (error, response) {
			if (error) {
				console.log(error);
			} else {
				const body = JSON.parse(response.body)
				await userService.saveOAuthData(body);
				return res.render('onboarding');
			}
		});
	
}}

exports = module.exports = {
	oAuth,
}