const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jokesSchema = new Schema({
	jokeStatement: {
		type: String,
		required: true
	},
	jokeAnswer: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

jokesSchema.index({ jokeStatement: 1 });

const activeJokesSchema = new Schema({
	teamId: {
		type: String,
		required: true
	},
	channelId: {
		type: String,
		required: true
	},
	jokeId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	jokeStatement: {
		type: String,
		required: true
	},
	jokeAnswer: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now()
	}
});

activeJokesSchema.index({teamId:1, channelId: 1});

const jokesModel = mongoose.model('jokes', jokesSchema, 'jokes');
const activeJokesModel = mongoose.model('activeJokes', activeJokesSchema, 'activeJokes');

function getSpicyJoke({jokeNumber}) {
	if(!jokeNumber || jokeNumber.constructor !== Number) {
		return Promise.reject(new Error(`invalid jokeNumber ${jokeNumber}`));
	}

	return jokesModel.findOne({}).skip(jokeNumber).lean().exec();
}

function createJoke({jokeStatement, jokeAnswer}) {
	if(!jokeStatement || jokeStatement == '' || !jokeAnswer || jokeAnswer == '') {
		return Promise.reject(new Error("invalid parameters"));
	}

	const joke = new jokesModel({
		jokeStatement: jokeStatement, 
		jokeAnswer: jokeAnswer
	});

	return joke.save();
}

function removeAllJokes() {
	return jokesModel.remove({});
}

function createActiveJoke({teamId, channelId, jokeId, jokeStatement, jokeAnswer}) {
	if (!teamId || !channelId || !jokeId || !jokeStatement || !jokeAnswer) {
		return Promise.reject(new Error("invalid parameters"));
	}

	return activeJokesModel.update({teamId: teamId, channelId, channelId}, {$set: {
		teamId: teamId,
		channelId: channelId,
		jokeId: jokeId,
		jokeStatement: jokeStatement,
		jokeAnswer: jokeAnswer,
		created: Date.now()}
	}, {upsert: true}).exec();
}

function getActiveJoke({teamId, channelId}){
	if (!teamId || !channelId) {
		return Promise.reject(new Error("invalid parameters"));
	}

	return activeJokesModel.findOne({teamId: teamId, channelId: channelId}).exec();
}

function removeActiveJoke({teamId, channelId}){
	return activeJokesModel.remove({teamId: teamId, channelId: channelId}).exec();
}

exports = module.exports = {
	getSpicyJoke,
	createJoke,
	removeAllJokes,
	createActiveJoke,
	getActiveJoke,
	removeActiveJoke
}