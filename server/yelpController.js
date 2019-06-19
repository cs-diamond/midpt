const yelpController = {
  getRadius: (req, res, next) => {

    let maxRad = 0;

    function distance(lat1, lon1, lat2, lon2, unit) {
      if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
      }
      else {
        const radlat1 = Math.PI * lat1/180;
        const radlat2 = Math.PI * lat2/180;
        const theta = lon1-lon2;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344 }
        if (unit === "N") { dist = dist * 0.8684 }
        return dist;
      }
    }

    res.locals.isoIntersectionPoints.forEach(intersection => {
      if (distance(res.locals.midpt.lat, res.locals.midpt.lng, intersection.lat, intersection.lng, 'K') > maxRad) {
        maxRad = distance(res.locals.midpt.lat, res.locals.midpt.lng, intersection.lat, intersection.lng, 'K')
      }
    });

    res.locals.radius = Math.floor(maxRad * 1000);
    console.log(res.locals.radius);

    next();
  },

  getNearby: (req, res, next) => {
    next();
  },
};

module.exports = yelpController;
