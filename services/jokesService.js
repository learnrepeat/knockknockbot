const jokesRepository = require('repositories/jokesRepository');

function getSpicyJoke(options) {
	return jokesRepository.getSpicyJoke(options);
}

function createJoke(options) {
	return jokesRepository.createJoke(options);
}

function removeAllJokes() {
	return jokesRepository.removeAllJokes();
}

function createActiveJoke(options) {
	return jokesRepository.createActiveJoke(options);
}

function getActiveJoke(options){
	return jokesRepository.getActiveJoke(options);
}

function removeActiveJoke(options) {
	return jokesRepository.removeActiveJoke(options)
}

module.exports = exports = {
	getSpicyJoke,
	createJoke,
	removeAllJokes,
	createActiveJoke,
	getActiveJoke,
	removeActiveJoke
}