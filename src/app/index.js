
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

axios.get(url, { params : routeParams } )
  .then( response => {

    xmlParser( response.data,  (e,r) => {

        //console.log( JSON.stringify(r.body.route));
        const rdef = r.body.route[0].$

        //display a simple bouding box of the route
        const bounds = turf.polygon([[
            [rdef.lonMin,rdef.latMin],
            [rdef.lonMin,rdef.latMax],
            [rdef.lonMax,rdef.latMax],
            [rdef.lonMax,rdef.latMin],
            [rdef.lonMin,rdef.latMin]            
            ]], rdef );

        var bbox = {
            type: 'FeatureCollection',
            features: [ bounds ]
        }

        map.addLayer({ 
            'id' : rdef.title, 
            'type': 'fill',
            'source': {
                'type':'geojson',
                'data': bbox
            },
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.2
            }            
        });

        const paths = r.body.route[0].path.map( 
            segment => segment.point.map( 
                p => [ p.$.lon, p.$.lat ] ));

        map.addLayer({
            'id':'65 South',
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
            'id':'65 North',
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


    });

  })
  .catch(function (error) {
    console.log(error);
  });

//from: https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
const toggleableLayerIds = [ '65 North', '65 South' ];

toggleableLayerIds.forEach( id => {

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = e => {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        const visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);
});


axios.get(url, { params : vehicleLocationParms } )
  .then( response => {
    xmlParser( response.data,  (e,r) => {
        console.log( JSON.stringify(r.body.lastTime[0].$.time));
        console.log( JSON.stringify(r.body.vehicle));
    });
  });
