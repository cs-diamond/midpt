
'use strict';

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = process.env.YELP_API_KEY;



const yelpController = {
  /*
  getRadius: (req, res, next) => {
    next();
  },
  */

  getNearby: (req, res, next) => {
    //console.log(res.locals);
    const searchRequest = {
      //term:'Four Barrel Coffee',
      latitude: res.locals.midpt.lat,
      longitude: res.locals.midpt.lng,
      categories: "coffee"
    };
    
    const client = yelp.client(apiKey);
    
    client.search(searchRequest).then(response => {
      const result = response.jsonBody.businesses;
      let yelpData = [];
      for (let i = 0; i < result.length;i++){
        let resultAtI = result[i];
        let lng = resultAtI.coordinates.longitude;
        let lat = resultAtI.coordinates.latitude;
        resultAtI.coordinates.lat = lat;
        resultAtI.coordinates.lng = lng;
        delete resultAtI.coordinates.longitude;
        delete resultAtI.coordinates.latitude;
        yelpData.push(resultAtI);
        //latLong.push({lat:result[i].coordinates.latitude,lng:result[i].coordinates.longitude});
      }
      res.locals.yelpData = yelpData;
      //console.log(res.locals);
    
      //const prettyJson = JSON.stringify(yelpData, null, 4);
      //console.log(prettyJson);
      return next();
    })
    .catch(e => {
      console.log(e);
    });
  },
};

module.exports = yelpController;
