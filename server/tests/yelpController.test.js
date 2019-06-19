const yelpController = require('../yelpController');

describe('yelpController', () => {
  let res, req, next;
  const now = new Date();
  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      locals: {},
    };
    next = {};
  });

  describe('yelpRadius.getRadius', () => {
    xit('Some test', () => {
      return new Promise(resolve => {
        yelpController.getRadius(req, res, err => {
          if (!err) {
            resolve(res.locals);
          }
        });
      }).then(result => {
        expect(result).toBe('number');
      });
    });
  });

  describe('yelpController.getNearby', () => {
    xit('Some test', () => {
      return new Promise(resolve => {
        yelpController.getNearby(req, res, err => {
          if (!err) {
            resolve(res.locals);
          }
        });
      }).then(result => {
        expect(result).toBe('number');
      });
    });
  });
});
