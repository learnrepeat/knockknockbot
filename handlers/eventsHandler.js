const config = require('config');
const request = require('request');
const { WebClient } = require('@slack/client');
const fuzz = require('fuzzball');
const moment = require('moment');

const jokesService = require('services/jokesService');
const userService = require('services/userService');

const eventRoutes = {
	"joke/new": sendNewJoke,
	"joke/answer": sendJokeAnswer,
}

async function receiveEvents(req, res, next) {
	const userOAuth = await userService.getOAuthData({teamId: req.body.team_id});
	req.userOAuth = userOAuth;

	const requestType = await _eventClassifier(req, res);
	const eventHandlerFunc = eventRoutes[requestType.route];
	if (eventHandlerFunc == null) {
		logger.error(`invalid event type ${requestType}`);
		return;
	}

	eventHandlerFunc(req, res, requestType.ctx);
}

async function sendNewJoke(req, res) {
	const min = 1;
	const max = 2;

	const jokeNumber = Math.floor(Math.random() * (max - min + 1)) + min;
	const spicyJoke = await jokesService.getSpicyJoke({jokeNumber});

	await jokesService.removeActiveJoke({teamId: req.body.team_id, channelId: req.body.event.channel});
	await jokesService.createActiveJoke({...spicyJoke, jokeId:spicyJoke._id, channelId:req.body.event.channel, teamId:req.body.team_id});
	await _sendMessage({botAccessToken: req.userOAuth.bot.botAccessToken, channel: req.body.event.channel, text: spicyJoke.jokeStatement});
}

async function sendJokeAnswer(req, res, ctx) {
	const startIndex = req.body.event.text.indexOf(">") + 1;
	const userResponse = req.body.event.text.substring(startIndex).trim();

	if (_isValidResponse(userResponse, ctx.jokeStatement)) {
		await jokesService.removeActiveJoke({teamId: ctx.teamId, channelId: ctx.channelId});
		return _sendMessage({botAccessToken: req.userOAuth.bot.botAccessToken, channel: req.body.event.channel, text: ctx.jokeAnswer + _laugingEmoji()});
	}

	return _sendMessage({botAccessToken: req.userOAuth.bot.botAccessToken, channel: req.body.event.channel, text: _tryAgainResponse(ctx.jokeStatement)});
}

function _sendMessage({botAccessToken, channel, text}) {
	const web = new WebClient(botAccessToken);
	return web.chat.postMessage({ channel: channel, text: text, as_user:false });
}

async function _eventClassifier(req, res) {
	if (_isEmptyDirectMention(req.body.event)) {
		return {route: "joke/new"};
	}

	const teamId = req.body.team_id;
	const channelId = req.body.event.channel;
	const activeJoke = await jokesService.getActiveJoke({teamId, channelId: channelId});	
	
	let diff = 0;
	if (activeJoke != null && activeJoke.created != null) {
		const date = moment(activeJoke.created);
		const now = moment();
		diff = now.diff(date, 'days');
	}

	if (!activeJoke || diff > 0) {
		return {route: "joke/new"};
	}

	return {route: "joke/answer", ctx: activeJoke};
}

function _isEmptyDirectMention(event) {
  if(event.subtype === "bot_message") {
    return false;
  }
  
  const text = event.text;
  if (!text) {
    return false;
  }
  
  return text.indexOf(">") === text.length -1;
}

function _isValidResponse(userResponse, jokeStatement) {
	const idealResponse = `${jokeStatement} who?`;
	const ratio = fuzz.ratio(idealResponse, userResponse.toString());
	return ratio >= 93;
}

function _tryAgainResponse(jokeStatement){
	const responses = [
		"keep to the script boi",
		`psst you're supposed to say: *${jokeStatement} who?*`
	];

	const min = 0;
	const max = responses.length-1;
	const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
	return responses[randomNumber];
}

function _laugingEmoji(){
	const responses = [
		":rolling_on_the_floor_laughing:",
		":grinning:",
		":grin:",
		":joy:",
		":smiley:",
		":laughing:",
		":wink:",
		":sunglasses:",
		":hugging_face:",
		":smirk:",
		":stuck_out_tongue:",
		":stuck_out_tongue_winking_eye:",
		":upside_down_face:",
		":grimacing:",
		":face_with_hand_over_mouth:",
		":woman-tipping-hand:",
		""
	];

	const min = 0;
	const max = responses.length-1;
	const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

	return "   " + responses[randomNumber];
}

exports = module.exports = {
	receiveEvents,
}