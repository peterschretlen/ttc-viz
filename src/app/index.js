
const axios = require('axios');
const xml2js = require('xml2js');
const xmlParser = (new xml2js.Parser()).parseString;
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const turf = require('@turf/turf');
const n65 = require('../data/processed/65_north.json');
const s65 = require('../data/processed/65_south.json');

const url = 'http://webservices.nextbus.com/service/publicXMLFeed';
const routeParams = {
    command: 'routeConfig',
    a: 'ttc',
    r: '65'
}

const vehicleLocationParms = {
    command: 'vehicleLocations',
    a: 'ttc',
    r: '65',
    t: '1495374664331'    
}


mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJzY2hyZXRsZW4iLCJhIjoiY2oyZHIxZ2diMDZrZjJ3cXl1bDVpY3FwZyJ9.D1guBUz1ULS2LBCltPeYOg';

//center on toronto
var center = new mapboxgl.LngLat(-79.3617018, 43.6625437);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: center,
  zoom: 14,
  scrollZoom: true
});

map.on('load', () => {

    map.addLayer({
        'id':'65 S Route',
        'type':'line',
        'source':{
            'type':'geojson',
            'data': s65
        },
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': `#F00`,
            'line-width': 5,
            'line-opacity': 0.5
        }
    });

    map.addLayer({
        'id':'65 N Route',
        'type':'line',
        'source':{
            'type':'geojson',
            'data': n65
        },
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': `#00F`,
            'line-width': 5,
            'line-opacity': 0.5
        }
    });

    const toggleableLayerIds = [ '65 N Route',  '65 S Route', ];
    addLayerToggles( toggleableLayerIds )

    axios.get(url, { params : vehicleLocationParms } )
      .then( response => {
        xmlParser( response.data,  (e,r) => {
            //console.log( JSON.stringify(r.body.lastTime[0].$.time));
            //console.log( JSON.stringify(r.body.vehicle));

            const locations = r.body.vehicle.map( l => l.$ )

            const s65Locations = locations
                .filter( l => l.dirTag === "65_0_65" )
                .map( l => { return {
                    "type" : "Feature",
                    "geometry" : {
                        "type" : "Point",
                        "coordinates" : [ l.lon, l.lat ] 
                    },
                    "properties" : {
                        "title" : l.id
                    }
                }});

            const n65Locations = locations
                .filter( l => l.dirTag === "65_1_65" )
                .map( l => { return {
                    "type" : "Feature",
                    "geometry" : {
                        "type" : "Point",
                        "coordinates" : [ l.lon, l.lat ] 
                    },
                    "properties" : {
                        "title" : l.id
                    }
                }});

            map.addLayer({
                'id':'65 S Locations',
                'type':'circle',
                'source':{
                    'type':'geojson',
                    'data': {
                        "type" : "FeatureCollection",
                        "features": s65Locations
                    }
                },
                'paint': {
                    "circle-radius" : 5,
                    "circle-color" : "#F00"
                }
            });

            map.addLayer({
                'id':'65 N Locations',
                'type':'circle',
                'source':{
                    'type':'geojson',
                    'data': {
                        "type" : "FeatureCollection",
                        "features": n65Locations
                    }
                },
                'paint': {
                    "circle-radius" : 5,
                    "circle-color" : "#00F"
                }
            });

        });

        const toggleableLayerIds = [ '65 N Locations', '65 S Locations' ];
        addLayerToggles( toggleableLayerIds );
        
      });


} )

//from: https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
function addLayerToggles( ids ){

    ids.forEach( id => {

        const link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;

        link.onclick = e => {
            const clickedLayer = e.target.textContent;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                e.target.className = '';
            } else {
                e.target.className = 'active';
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);
    });

}

