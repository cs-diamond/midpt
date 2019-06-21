const request = require('request');
// given a location string, computes the geocoded result, which includes a lat & long as well as a formatted address.
// INPUT: location (string)
// OUTPUT: promise whose resolved value is an object with latLng {lat: number, lng: number} and formatted_address: string properties.
module.exports = locationStr => {
  const result = {};
  return new Promise((resolve, reject) => {
    // return a promise that resolves when it receives the result from the google get request
    request.get(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        locationStr +
        '&key=' +
        process.env.GOOGLE_MAPS_API_KEY, // grabs this from .env. make sure to create one of your own with your own api keys!
      { json: true },
      (err, response, body) => {
        if (err) {
          console.log('GMAPS GEOCODE ERR HANDLER', err);
          reject(err);
        }
        result.latLng = body.results[0].geometry.location;
        result.formatted_address = body['results'][0].formatted_address;
        resolve(result);
      }
    );
  });
};
