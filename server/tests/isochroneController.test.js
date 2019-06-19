const isochroneController = require('../isochroneController');

describe('isochroneController', () => {
  let res, req, next;
  const now = new Date();
  beforeEach(() => {
    req = {
      body: {
        points: ['Codesmith', 'Soylent'],
        departureTime: now.setHours(now.getHours() + 1), // must be time in the future
      },
    };
    res = {
      locals: {},
    };
    next = {};
  });

  describe('isochroneController.getCoords', () => {
    xit('res.locals.departureTimeUNIX should be a valid integer', () => {
      isochroneController.getCoords(req, res, next);
      expect(typeof res.locals.departureTimeUNIX).toBe('number');
      expect(Math.round(res.locals.departureTimeUNIX)).toEqual(
        res.locals.departureTimeUNIX
      );
    });
    xit('res.locals.departureTimeUNIX should be a valid UNIX time format', () => {
      isochroneController.getCoords(req, res, next);
      expect(res.locals.departureTimeUNIX).toEqual(
        Math.round(new Date(req.body.departureTime).valueOf() / 1000)
      );
    });

    describe('isochroneController.generateRoutes', () => {
    it('res.locals.fairTime should be a real number greater than 0', async () => {
      res.locals.departureTimeUNIX = Math.round(new Date(req.body.departureTime).valueOf() / 1000);
      await isochroneController.generateRoutes(req, res, next);
      //console.log('GENROUTES res.locals: ', res.locals);
      // await console.log('GENROUTES res.locals: ', res.locals);
      expect(res.locals.fairTime).resolves.toBe('number');
    });
  });

  });

  describe('isochroneController.generateRoutes', () => {
    it('res.locals.fairTime should be a real number greater than 0', async () => {
      res.locals.points = [
        { lat: 33.9878333, lng: -118.4705734 },
        { lat: 34.0523411, lng: -118.2471898 },
      ];
      res.locals.addresses = [
        '1600 Main St 1st floor, Venice, CA 90291, USA',
        '207 S Broadway, Los Angeles, CA 90012, USA',
      ];
      res.locals.departureTimeUNIX = Math.round(
        new Date(req.body.departureTime).valueOf() / 1000
      );
      return new Promise(resolve => {
        isochroneController.generateRoutes(req, res, err => {
          if (!err) {
            resolve(res.locals.fairTime);
          }
        });
      }).then(result => {
        expect(typeof result).toBe('number');
      });
    });
  });
});
