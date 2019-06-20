const request = require('request');
require('dotenv').config();
// const isochrone = require('../isochrone');
const turf = require('@turf/turf');
const geocode = require('./geocode');

const isochroneController = {};
//this function turns addresses into latitude and longitude coordinates
isochroneController.getCoords = (req, res, next) => {
  console.log('REQ', req);
  res.locals.addresses = [];
  res.locals.points = [];
  //gets the time for our navigation queries
  const dateObj = new Date(req.body.departureTime);
  res.locals.departureTimeISO = dateObj.toISOString(); // for time travel api
  res.locals.departureTimeUNIX = Math.round(dateObj.valueOf() / 1000); //for google api
  // ✅ TEST: res.locals.departureTimeUNIX should be valid UNIX time
  // ✅ TEST: res.locals.departureTimeUNIX should be an integer

  let promArr = [];
  for (let i = 0; i < req.body['points'].length; i++) {
    //removes whitespace, formats for queries
    let parsedStr = req.body['points'][i].replace(' ', '+');
    promArr.push(geocode(parsedStr));
  }
  Promise.all(promArr)
    .then(ptsAddresses => {
      //catches each address and formats it into usable data
      ptsAddresses.forEach(ptAddressObj => {
        res.locals.addresses.push(ptAddressObj.formatted_address);
        // ✅ TEST: res.locals.address should have the correct string format
        res.locals.points.push(ptAddressObj.latLng);
        // ✅ TEST: res.locals.address should have the correct lat/lng format
      });
      return next();
    })
    .catch(err => {
      res.status(404).json(err);
    });
};

isochroneController.generateRoutes = (req, res, next) => {
  const promArr = [];
  let n = req.body['points'].length;
  for (let i = 0; i < n ; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (i !== j) {
        promArr.push(
          new Promise((resolve, reject) => {
            //this syntax is just to make the code iterable
            const thisPt = res.locals.points[i % res.locals.points.length];
            const otherPt = res.locals.points[j % res.locals.points.length];
            //grabbing initial route info for FAIR TIME ALGORITHM
            request.get(
              `https://maps.googleapis.com/maps/api/directions/json?origin=
               ${thisPt.lat},${thisPt.lng}
               &destination=${otherPt.lat},${otherPt.lng}
               &departure_time=${res.locals.departureTimeUNIX}
               &key=` + process.env.GOOGLE_MAPS_API_KEY,
              (err, res, body) => {
                if (err) reject(err);
                console.log(JSON.parse(body));
                resolve(
                  JSON.parse(body).routes[0].legs[0].duration_in_traffic.value
                );
              });
          })
        );
      }
    }
  }
  //waits for queries and then logs travel times for verification and developer peace of mind
  Promise.all(promArr).then(values => {
    console.log('FAIRTIME VALUES', values);
    for (let i = 0; i < res.locals.addresses.length; i += 1) {
      console.log(`finding a midpt for user${i + 1} at ${res.locals.addresses[i]} - estimated travel time is ${values[i] / 60}`)
    }
    //the FAIR TIME ALGORITHM for 2 people
    res.locals.fairTime = Math.ceil((1 - values[0] / (values[0] + values[1])) * values[0]);
    console.log('FAIR TIME', res.locals.fairTime);
    // ✅ TEST: res.locals.fairTime should be a real number greater than 0
    next();
  });
};

isochroneController.generateIsochrones = (req, res, next) => {
  // finds isochrones around the two user points using the Bing API, and then finds the intersection polygons of those isochrones using turf.js
  // if there is no intersection, the while loop runs again with a higher fairTime until it finds a result. however, it mostly succeeds on the first try!

  let friendIsochrones = [];
  async function tryIntersection(time) {
    let curIntersection = null;
    let timeToTry = time;
    while (!curIntersection) {
      console.log(
        'trying isochrone intersection with a fairTime of ',
        timeToTry / 60
      );
      friendIsochrones = [];
      for (let i = 0; i < res.locals.addresses.length; i += 1) {
        friendIsochrones.push(
          await new Promise((resolve, reject) => {
            const thisPt = res.locals.points[i % res.locals.points.length];
            request.get(
              `https://dev.virtualearth.net/REST/v1/Routes/Isochrones?` +
                `dateTime=06/17/2019` +
                `&waypoint=${thisPt.lat},${thisPt.lng}` +
                `&maxTime=${timeToTry}` +
                `&distanceUnit=mile` +
                `&optimize=timeWithTraffic` +
                `&travelMode=driving` +
                `&key=${process.env.BING_MAPS_API_KEY}`,
              (err, res, body) => {
                if (err) res.status(404).send(err);
                const arrayOfLatLngPoints = JSON.parse(body).resourceSets[0]
                  .resources[0].polygons[0].coordinates[0];
                // sometimes it might not be one polygon!!! so would need to have multiple i's for coordinates
                resolve(turf.polygon([arrayOfLatLngPoints]));
              }
            );
          })
        );
      }
      curIntersection = turf.intersect(...friendIsochrones);
      timeToTry = Math.ceil(timeToTry * 1.2);
    }
    res.locals.isochrones = [];
    for (let i = 0; i < res.locals.addresses.length; i += 1) {
      res.locals.isochrones.push(
        friendIsochrones[i].geometry.coordinates[0].map(point => {
          return { lat: point[0], lng: point[1] };
        })
      );
    }
    let coords = curIntersection.geometry.coordinates;
    res.locals.coords = coords;
    res.locals.coordsGeoType = curIntersection.geometry.type;
    res.locals.isoIntersectionPoints = [];
    if (curIntersection.geometry.type === 'Polygon') {
      res.locals.isoIntersectionPoints.push(
        coords[0].map(el => {
          return { lat: el[0], lng: el[1] };
        })
      );
    } else {
      console.log('its a multi');
      //res.locals.coords = coords;
      for (let i = 0; i < coords.length; i++) {
        res.locals.isoIntersectionPoints.push(
          coords[i][0].map(el => {
            return { lat: el[0], lng: el[1] };
          })
        );
      }
    }
    //debugger;
    next();
  }

  tryIntersection(res.locals.fairTime);
  // ✅ TEST: res.locals.isoIntersectionPoints should be an array of objects containing lat/lng properties
  // ✅ TEST: res.locals.isochrones should be an array of objects containing lat/lng properties
};

module.exports = isochroneController;
