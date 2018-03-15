//NODE_ENV=dev NODE_PATH=. node scripts/seedScript.js scripts/content/knockknockjokes.csv

const mongo = require('common/db').connection;
const fs = require('fs');
const parse = require('csv-parse');

const jokesService = require('services/jokesService')

const arg = process.argv.slice(2);
const fileName = arg[0];

const parser = parse({delimiter: ','}, parseCsv);
async function parseCsv(err, data) {
	await mongoConnection();
	await jokesService.removeAllJokes();

	for(var i=0; i<data.length; i++){
		const row = data[i];
		const options = {
			jokeStatement: row[0],
			jokeAnswer: row[1]
		}

		await jokesService.createJoke(options);
	};

	console.log("done");
	process.exit(0);
}

function mongoConnection() {
	return new Promise((resolve, reject) => {
		mongo.once('open', function () {
			console.log("Connected to database");
			return resolve();
		});
	});
}

fs.createReadStream(fileName).pipe(parser);