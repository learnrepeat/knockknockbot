const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oAuthDataSchema = new Schema({
	accessToken: String,
	scope: String,
	userId: String,
	teamName: String,
	teamId: String,
	bot: {
		botUserId: String,
		botAccessToken: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

oAuthDataSchema.index({teamId:1});
const oAuthDataModel = mongoose.model('oAuthData', oAuthDataSchema, 'oAuthData');

function saveOAuthData({access_token, scope, user_id, team_name, team_id, bot}) {
	return oAuthDataModel.update({teamId: team_id}, {$set: {
		accessToken: access_token, 
		scope: scope,
		userId: user_id,
		teamName: team_name,
		teamId: team_id, 
		bot: {
			botUserId: bot.bot_user_id,
			botAccessToken: bot.bot_access_token
		},
		created: Date.now()}
	}, {upsert: true}).exec();
}

function getOAuthData({teamId}) {
	if (!teamId) {
		return Promise.reject(new Error("invalid parameters"));
	}

	return oAuthDataModel.findOne({teamId: teamId},{teamId: 1, "bot.botAccessToken": 1}).exec();
}

module.exports = exports = {
	saveOAuthData,
	getOAuthData
}