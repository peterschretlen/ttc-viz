const dsv = require('d3-dsv');
const fs = require('fs');

function shape2geojson(file){
	return loadGtfs(file).then( (points) => gtfs2Feature(points) )
}

function loadGtfs(file){

	return new Promise( (resolve, reject) => {

		fs.readFile(file, 'utf8', function(err, data) {  
		    if (err) reject(err);
			const points = dsv.csvParseRows(data, (d) => {
				return {
					id: d[0],
					lat: d[1],
					lon: d[2],
					seq: d[3],
					pdist: d[4] 
				}
			}); 
			resolve(points);
		});
	} );

}

function gtfs2Feature(points){

	return new Promise( (resolve, reject ) => {

		const coordinates = points.map( p => [ p.lon, p.lat ] )
		const feature = 
		{
			'type': 'Feature',
			'properties': {},
			'geometry': {
			    'type': 'LineString',
			    'coordinates': coordinates
			}
		}

		resolve(feature);

	});


}

module.exports = shape2geojson;