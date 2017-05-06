
const axios = require('axios');
const xmlParser = (new require('xml2js').Parser()).parseString;

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