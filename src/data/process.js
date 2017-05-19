const shape2geojson = require('./util/gtfsHelper');
const fs = require('fs');

function convertCSV(filename) {

	shape2geojson(`../data/raw/${filename}.csv`).then( feature => {
		fs.writeFileSync(`../data/processed/${filename}.json`, JSON.stringify(feature), 'utf8');
	});

}

convertCSV('65_north');
convertCSV('65_south');