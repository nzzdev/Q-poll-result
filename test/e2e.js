'use strict';

const expect = require('chai').expect;
const server = require('../server.js');
const plugins = require('../server-plugins.js');
const routes = require('../routes/routes.js');

async function start() {
  await server.register(plugins);
  server.route(routes);
  await server.start();

  // some basic API tests
  describe('Q required API', () => {

    it('should return 200 for /schema.json', async () => {
      const response = await server.inject('/schema.json')
      expect(response.statusCode).to.be.equal(200);
    })

    it('should return 200 for /stylesheet/default.123.css', async () => {
      const response = await server.inject('/stylesheet/default.123.css') 
      expect(response.statusCode).to.be.equal(200);
    })

    it('should return 404 for inexistent stylesheet', async () => {
      const response = await server.inject('/stylesheet/inexisting.123.css');
      expect(response.statusCode).to.be.equal(404);
    })

  });

  const mockData = JSON.parse(JSON.stringify(require('./resources/mock-data.js')));

  describe('rendering-info endpoints', () => {

    it('should return 200 for /rendering-info/html-static', async () => {
      const request = {
        method: 'POST',
        url: '/rendering-info/html-static',
        payload: JSON.stringify({ item: mockData })
      };
      const response = await server.inject(request);
      expect(response.statusCode).to.be.equal(200);
    })
  });
}

start();
