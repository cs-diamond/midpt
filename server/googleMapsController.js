const googleMapsController = {
  // generate two URLS that go to
  genGoogleMapsURL: (req, res, next) => {
    res.locals.directionURLs = [];
    for (let i = 0; i < 2; i++) {
      const thisPt = res.locals.points[i % res.locals.points.length];
      res.locals.directionURLs.push(
        `https://www.google.com/maps/dir/?api=1&origin=${thisPt.lat},${thisPt.lng}&destination=${res.locals.midpt.lat},${res.locals.midpt.lng}&travelmode=driving`
      );
    }
    next();
    // ✅ TEST: res.locals.directionURLs should be an array with URLs with specific URL text content
  },
};

module.exports = googleMapsController;
