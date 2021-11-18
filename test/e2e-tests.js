const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Joi = require("joi");
const lab = (exports.lab = Lab.script());
const glob = require("glob");

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
    server.validator(Joi);
    await server.register(Inert);
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

lab.experiment("basics", () => {
  it("starts the server", () => {
    expect(server.info.created).to.be.a.number();
  });

  it("is healthy", async () => {
    const response = await server.inject("/health");
    expect(response.payload).to.equal("ok");
  });
});

lab.experiment("schema endpoint", () => {
  it("returns 200 for /schema.json", async () => {
    const response = await server.inject("/schema.json");
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("locales endpoint", () => {
  it("returns 200 for en translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/en/translation.json",
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });

  it("returns 200 for fr translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/fr/translation.json",
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });

  it("returns 200 for de translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/de/translation.json",
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("stylesheets endpoint", () => {
  it(
    "returns existing stylesheet with right cache control header",
    { plan: 2 },
    async () => {
      const filename = require("../styles/hashMap.json").default;
      const response = await server.inject(`/stylesheet/${filename}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.headers["cache-control"]).to.be.equal(
        "max-age=31536000, immutable"
      );
    }
  );

  it("returns Not Found when requesting an inexisting stylesheet", async () => {
    const response = await server.inject("/stylesheet/inexisting.123.css");
    expect(response.statusCode).to.be.equal(404);
  });
});

lab.experiment("rendering-info endpoint", () => {
  it("returns 200 for /rendering-info/web", async () => {
    const request = {
      method: "POST",
      url: "/rendering-info/web",
      payload: {
        item: require("../resources/fixtures/data/mixed-3-5-sorted.json"),
        toolRuntimeConfig: {
          displayOptions: {},
        },
      },
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("all non validation fixtures render", () => {
  const fixtureFiles = glob.sync(
    `${__dirname}/../resources/fixtures/data/*.json`
  );

  for (let fixtureFile of fixtureFiles) {
    const fixture = require(fixtureFile);

    if (!fixture.title.toLowerCase().includes("validation")) {
      it(`doesnt fail in rendering fixture ${fixture.title}`, async () => {
        const request = {
          method: "POST",
          url: "/rendering-info/web",
          payload: {
            item: fixture,
            toolRuntimeConfig: {},
          },
        };
        const response = await server.inject(request);
        expect(response.statusCode).to.be.equal(200);
      });
    }
  }
});
