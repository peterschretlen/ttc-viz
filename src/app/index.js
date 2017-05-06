
const axios = require('axios');
const xml2js = require('xml2js');
const xmlParser = (new xml2js.Parser()).parseString;
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const url = 'http://webservices.nextbus.com/service/publicXMLFeed';
const routeParams = {
    command: 'routeConfig',
    a: 'ttc',
    r: '501', 
}

axios.get(url, { params : routeParams } )
  .then(function (response) {

    xmlParser( response.data,  (e,r) => {

        console.log( JSON.stringify(r.body.route));

    } )

  })
  .catch(function (error) {
    console.log(error);
  });


mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJzY2hyZXRsZW4iLCJhIjoiY2oyZHIxZ2diMDZrZjJ3cXl1bDVpY3FwZyJ9.D1guBUz1ULS2LBCltPeYOg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9'
});