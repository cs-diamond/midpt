const isochroneController = require('../isochroneController');

describe('isochroneController', () => {
  let res, req, next;
  beforeEach(() => {
    req = {
      body: {
        points: ['Codesmith', 'Soylent'],
        departureTime: '2019-06-18T23:52:20.856Z',
      },
    };
    res = {
      locals: {},
    };
    next = {};
  });

  describe('isochroneController.getCoords', () => {
    it('res.locals.departureTimeUNIX should be a valid integer', () => {
      isochroneController.getCoords(req, res, next);
      expect(typeof res.locals.departureTimeUNIX).toBe('number');
      expect(Math.round(res.locals.departureTimeUNIX)).toEqual(
        res.locals.departureTimeUNIX
      );
    });
    it('res.locals.departureTimeUNIX should be a valid UNIX time format', () => {
      isochroneController.getCoords(req, res, next);
      expect(res.locals.departureTimeUNIX).toEqual(
        Math.round(new Date(req.body.departureTime).valueOf() / 1000)
      );
    });
  });
});
