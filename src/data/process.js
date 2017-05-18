const shape2geojson = require('./util/gtfsHelper');

shape2geojson("../data/raw/65_north.csv").then( feature => console.log( JSON.stringify(feature) ));