const request = require('supertest');
const server = 'http://localhost:3000';

describe('Route integration', () => {
  describe('/buildroute', () => {
    describe('POST', () => {
      it('responds with 200 status and application/json content type', done => {
        const requestBody = {
          points: ['Codesmith', 'Soylent'],
          departureTime: '2019-06-19T23:52:20.856Z',
        };
        return request(server)
          .post('/buildroute')
          .send(requestBody)
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(({ body }) => {
            expect(body).toBeTruthy();
            done();
          });
      });
    });
  });
});
