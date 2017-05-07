
const axios = require('axios');
const xml2js = require('xml2js');
const xmlParser = (new xml2js.Parser()).parseString;
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const turf = require('@turf/turf');

const url = 'http://webservices.nextbus.com/service/publicXMLFeed';
const routeParams = {
    command: 'routeConfig',
    a: 'ttc',
    r: '501', 
}

mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJzY2hyZXRsZW4iLCJhIjoiY2oyZHIxZ2diMDZrZjJ3cXl1bDVpY3FwZyJ9.D1guBUz1ULS2LBCltPeYOg';

//center on toronto
var center = new mapboxgl.LngLat(-79.3832, 43.6532);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: center,
  zoom: 11,
  scrollZoom: true
});

axios.get(url, { params : routeParams } )
  .then(function (response) {

    xmlParser( response.data,  (e,r) => {

        //console.log( JSON.stringify(r.body.route));
        const rdef = r.body.route[0].$

        //display a simple bouding box of the route
        const bbox = turf.polygon([[
            [rdef.lonMin,rdef.latMin],
            [rdef.lonMin,rdef.latMax],
            [rdef.lonMax,rdef.latMax],
            [rdef.lonMax,rdef.latMin],
            [rdef.lonMin,rdef.latMin]            
            ]], rdef );

        var route = {
            type: 'FeatureCollection',
            features: [ bbox ]
        }

        map.addLayer({ 
            'id' : rdef.title, 
            'type': 'fill',
            'source': {
                'type':'geojson',
                'data': route
            },
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.2
            }            
        });

    });

  })
  .catch(function (error) {
    console.log(error);
  });
