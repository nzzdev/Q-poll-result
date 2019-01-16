const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const lab = (exports.lab = Lab.script());
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

const routes = require("../routes/routes.js");
require("svelte/ssr/register");
const staticTpl = require("../views/HtmlStatic.html");

let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true
      }
    });
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

function element(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelector(selector));
  });
}

function elementCount(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector).length);
  });
}

lab.experiment("Q poll result dom tests", function() {
  it("should pass if at least one legend is found", async () => {
    const renderingData = {
      item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
      pollTypeInfos: require("../resources/helpers/pollTypeInfos.js")
    };
    var markup = staticTpl.render(JSON.parse(JSON.stringify(renderingData)));
    return elementCount(markup, "ul.q-poll-result-legend").then(value => {
      expect(value).to.be.greaterThan(0);
    });
  });

  it("should pass if exactly one current result bar is found", async () => {
    const renderingData = {
      item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
      pollTypeInfos: require("../resources/helpers/pollTypeInfos.js")
    };
    var markup = staticTpl.render(JSON.parse(JSON.stringify(renderingData)));
    return elementCount(markup, "div.q-poll-result-poll--current").then(
      value => {
        expect(value).to.be.equal(1);
      }
    );
  });
});
