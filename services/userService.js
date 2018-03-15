const userRepository = require('repositories/userRepository');
const crypto = require('common/crypto');

function saveOAuthData(data) {
	data.access_token = crypto.encryptText(data.access_token);
	data.bot.bot_access_token = crypto.encryptText(data.bot.bot_access_token);

	return userRepository.saveOAuthData(data);
}

async function getOAuthData(data) {
	const oAuthData = await userRepository.getOAuthData(data);
	oAuthData.accessToken = oAuthData.accessToken != null ? crypto.decryptText(oAuthData.accessToken) : null;
	oAuthData.bot.botAccessToken = oAuthData.bot.botAccessToken != null ? crypto.decryptText(oAuthData.bot.botAccessToken) : null;

	return oAuthData;
}

module.exports = exports = {
	saveOAuthData,
	getOAuthData
}