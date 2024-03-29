const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const Hapi = require("@hapi/hapi");
const lab = (exports.lab = Lab.script());
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

const routes = require("../routes/routes.js");
let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
    });
    server.validator(require("joi"));
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

function elements(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector));
  });
}

function elementCount(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector).length);
  });
}

lab.experiment("dom tests", function () {
  it("should pass if at least one legend is found", async () => {
    const response = await server.inject({
      url: "/rendering-info/web?_id=someid",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
        pollTypeInfos: require("../resources/helpers/pollTypeInfos.js"),
        toolRuntimeConfig: {
          displayOptions: {},
        },
      },
    });

    return elementCount(response.result.markup, "ul.q-poll-result-legend").then(
      (value) => {
        expect(value).to.be.greaterThan(0);
      }
    );
  });

  it("should pass if exactly one current result bar is found", async () => {
    const response = await server.inject({
      url: "/rendering-info/web?_id=someid",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
        pollTypeInfos: require("../resources/helpers/pollTypeInfos.js"),
        toolRuntimeConfig: {
          displayOptions: {},
        },
      },
    });

    return elementCount(
      response.result.markup,
      "div.q-poll-result-poll--current"
    ).then((value) => {
      expect(value).to.be.equal(1);
    });
  });

  it("should pass if exactly three sub result bars are found", async () => {
    const response = await server.inject({
      url: "/rendering-info/web?_id=someid",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
        pollTypeInfos: require("../resources/helpers/pollTypeInfos.js"),
        toolRuntimeConfig: {
          displayOptions: {},
        },
      },
    });

    return elementCount(
      response.result.markup,
      ".q-poll-result-poll--current > .q-poll-result-bar"
    ).then((value) => {
      expect(value).to.be.equal(3);
    });
  });

  it("should have a correct footer element", async () => {
    const response = await server.inject({
      url: "/rendering-info/web?_id=someid",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
        pollTypeInfos: require("../resources/helpers/pollTypeInfos.js"),
        toolRuntimeConfig: {
          displayOptions: {},
        },
      },
    });

    return elementCount(response.result.markup, ".s-q-item__footer").then(
      (value) => {
        expect(value).to.be.equal(1);
      }
    );
  });
});
