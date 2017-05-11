const dsv = require('d3-dsv');
const fs = require('fs');

function shape2geojson(file){

	fs.readFile(file, 'utf8', function(err, data) {  
	    if (err) throw err;
		const rows = dsv.csvParseRows(data, (d) => {
			return {
				id: d[0],
				lat: d[1],
				lon: d[2],
				seq: d[3],
				pdist: d[4] 
			}
		}); 
		console.log(rows);
	});

}

shape2geojson("../data/raw/65_north.csv");