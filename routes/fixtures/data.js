const fixtureDataDirectory = "../../resources/fixtures/data";

// provide every fixture data file present in ../../resources/fixtures/data
const fixtureData = [
  require(`${fixtureDataDirectory}/mixed-3-5-sorted.json`),
  require(`${fixtureDataDirectory}/only-3-not-sorted-missing-url.json`),
  require(`${fixtureDataDirectory}/only-5-not-sorted.json`),
  require(`${fixtureDataDirectory}/only-3-not-sorted-one-not-100.json`),
  require(`${fixtureDataDirectory}/only-5-small-values.json`),
  require(`${fixtureDataDirectory}/spacing-text.json`)
];

module.exports = {
  path: "/fixtures/data",
  method: "GET",
  config: {
    tags: ["api"],
    cors: true
  },
  handler: (request, h) => {
    return fixtureData;
  }
};
