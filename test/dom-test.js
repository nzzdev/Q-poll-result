const JsDom = require('jsdom');
const expect = require('chai').expect;

let mockData = require('./resources/mock-data');
let renderingData = {
  item: mockData,
  pollTypeInfos: require('../resources/helpers/pollTypeInfos.js')
}
require('svelte/ssr/register');
const staticTpl = require('../views/HtmlStatic.html');
var markup = staticTpl.render(JSON.parse(JSON.stringify(renderingData)));


function element(selector) {
  return new Promise((resolve, reject) => {
    JsDom.env(
      markup,
      (err, window) => {
        resolve(window.document.querySelector(selector));
      })
  })
}

function elementCount(selector) {
  return new Promise((resolve, reject) => {
    JsDom.env(
      markup,
      (err, window) => {
        resolve(window.document.querySelectorAll(selector).length);
      })
  })
}

describe('Q poll result dom tests', function() {
  it('should pass if at least one legend is found', function() {
    return elementCount('ul.q-poll-result-legend').then(value => {
        expect(value).to.be.greaterThan(0);
    })
  })

  it('should pass if exactly one current result bar is found', function() {
    return elementCount('div.q-poll-result-poll--current').then(value => {
      expect(value).to.be.equal(1);
    })
  })
})
