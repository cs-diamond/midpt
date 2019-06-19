const isochroneController = require('../isochroneController');

describe('isochroneController', () => {
  let res, req, next;
  beforeEach(() => {
    req = {
      body: {
        points: ['Codesmith', 'Soylent'],
        departureTime: '2019-06-18T23:52:20.856Z',
        addresses: '1600 Main St'
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

    describe('isochroneController.generateRoutes', () => {
    it('res.locals.fairTime should be a real number greater than 0', async () => {
      res.locals.departureTimeUNIX = Math.round(new Date(req.body.departureTime).valueOf() / 1000);
      await isochroneController.generateRoutes(req, res, next);
      console.log('GENROUTES res.locals: ', res.locals);
      // await console.log('GENROUTES res.locals: ', res.locals);
      expect(res.locals.fairTime).resolves.toBe('number');
    });
  });
   /*
    it('res.locals.addresses should be a string', async() => {
      expect.assertions(1);
      isochroneController.getCoords(req, res, next);
      console.log(res.locals);
     await expect(res.locals.addresses.rejects.toEqual('1600 Main St'))
    });*/
  });
});
