const path = require("path");
const resourcesDir = path.join(__dirname, "/../resources/");

module.exports = {
  method: "GET",
  path: "/schema.json",
  handler: function (request, h) {
    return h.file(path.join(resourcesDir, "schema.json"));
  },
};
