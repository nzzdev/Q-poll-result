const Boom = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const viewsDir = path.join(__dirname, "/../../views/");
const stylesDir = path.join(__dirname, "/../../styles/");
const scriptsDir = path.join(__dirname, "/../../scripts/");
const resourcesDir = path.join(__dirname, "/../../resources/");

require("svelte/register");
const staticTemplate = require(path.join(viewsDir, "/App.svelte")).default;
const styles = fs.readFileSync(path.join(stylesDir, "/default.css")).toString();
const styleHashMap = require(path.join(stylesDir, "/hashMap.json"));
const scriptHashMap = require(path.join(scriptsDir, "/hashMap.json"));
const pollTypeInfos = require(path.join(
  resourcesDir,
  "/helpers/pollTypeInfos.js"
));

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../resources/", "schema.json"), {
    encoding: "utf-8",
  })
);

const ajv = new Ajv({ strict: false });
const validate = ajv.compile(schemaString);

function validateAgainstSchema(item, options) {
  if (validate(item)) {
    return item;
  } else {
    throw Boom.badRequest(JSON.stringify(validate.errors));
  }
}

async function validatePayload(payload, options, next) {
  if (typeof payload !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.item !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.toolRuntimeConfig !== "object") {
    return next(Boom.badRequest(), payload);
  }
  await validateAgainstSchema(payload.item, options);
}

module.exports = {
  method: "POST",
  path: "/rendering-info/web",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: validatePayload,
    },
  },
  handler: async function (request, h) {
    const context = {
      item: request.payload.item,
      pollTypeInfos: pollTypeInfos,
    };

    const staticTemplateRender = staticTemplate.render(context);

    const renderingInfo = {
      stylesheets: [{ content: styles }, { name: styleHashMap["default"] }],
      scripts: [{ name: scriptHashMap["default"] }],
      markup: staticTemplateRender.html,
    };

    return renderingInfo;
  },
};
