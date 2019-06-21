const yelp = require('yelp-fusion');
const turf = require('@turf/turf');
const apiKey = process.env.YELP_API_KEY;

const yelpController = {
  getRadius: (req, res, next) => {
    let maxRad = 0;
    function distance(lat1, lon1, lat2, lon2, unit) {
      if (lat1 === lat2 && lon1 === lon2) {
        return 0;
      } else {
        const radlat1 = (Math.PI * lat1) / 180;
        const radlat2 = (Math.PI * lat2) / 180;
        const theta = lon1 - lon2;
        const radtheta = (Math.PI * theta) / 180;
        let dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === 'K') {
          dist = dist * 1.609344;
        }
        if (unit === 'N') {
          dist = dist * 0.8684;
        }
        return dist;
      }
    }

    res.locals.isoIntersectionPoints.forEach(intersection => {
      if (
        distance(
          res.locals.midpt.lat,
          res.locals.midpt.lng,
          intersection.lat,
          intersection.lng,
          'K'
        ) > maxRad
      ) {
        maxRad = distance(
          res.locals.midpt.lat,
          res.locals.midpt.lng,
          intersection.lat,
          intersection.lng,
          'K'
        );
      }
    });

    res.locals.radius = Math.floor(maxRad * 1000);
    console.log(res.locals.radius);
    next();
  },


  getNearby: (req, res, next) => {
       //checking req.body for yelp category
       //console.log('Will',req.body.yelpCategory);
    const searchRequest = {
      latitude: res.locals.midpt.lat,
      longitude: res.locals.midpt.lng,
      categories: req.body.yelpCategory,
      radius: res.locals.radius,
      limit: 50,
      sort_by: 'rating',
      open_now: true
    };

    const client = yelp.client(apiKey);

    client
      .search(searchRequest)
      .then(response => {
        const result = response.jsonBody.businesses;
        let yelpData = [];
        for (let i = 0; i < result.length; i++) {
          let resultAtI = result[i];
          let lng = resultAtI.coordinates.longitude;
          let lat = resultAtI.coordinates.latitude;
          resultAtI.coordinates.lat = lat;
          resultAtI.coordinates.lng = lng;
          delete resultAtI.coordinates.longitude;
          delete resultAtI.coordinates.latitude;
          yelpData.push(resultAtI);
        }
        res.locals.yelpData = yelpData;

        let yelpPoints = yelpData.map(el => {
          return [el.coordinates.lat, el.coordinates.lng];
        });


        yelpPoints = turf.points(yelpPoints);

        let coords = res.locals.coords;

        if (res.locals.coordsGeoType === 'Polygon') {
          coords = turf.polygon(res.locals.coords);
        } else {
          coords = turf.polygon(res.locals.coords[0]);
        }

        let pointsWithin = turf.pointsWithinPolygon(yelpPoints, coords);

        res.locals.pointsWithin = pointsWithin;



        pointsWithin.features.forEach((el) => {
          // console.log('📍 pointsWithin latlong: ' + el.geometry.coordinates[0] + ', ' + el.geometry.coordinates[1]);
        });
        const filteredYelpData = [];
        yelpData.forEach(el => {
          // console.log('📍 yelpData latlong: ' + el.coordinates.lat + ', ' + el.coordinates.lng);
          pointsWithin.features.forEach(le => {
            if ((el.coordinates.lat === le.geometry.coordinates[0]) && (el.coordinates.lng === le.geometry.coordinates[1])) {
              filteredYelpData.push(el);
            }
          });
        });

        // console.log('filteredYelpData', filteredYelpData);
        res.locals.filteredYelpData = filteredYelpData;

        return next();
      })
      .catch(err => {
        console.log('YELP GET NEARBY ERR HANDLER', err);
        next(err);
      });
  },
};

module.exports = yelpController;
