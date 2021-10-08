const Boom = require("@hapi/boom");
const fs = require("fs");
const path = require("path");

const stylesDir = path.join(__dirname, "/../../styles/");
const styleHashMap = require(path.join(stylesDir, "hashMap.json"));
const scriptsDir = "../../scripts/";
const scriptHashMap = require(`${scriptsDir}/hashMap.json`);

// setup svelte
const viewsDir = `${__dirname}/../../views/`;
require("svelte/register");
const staticTemplate = require(viewsDir + "App.svelte").default;

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../resources/", "schema.json"), {
    encoding: "utf-8",
  })
);
const Ajv = require("ajv");
const ajv = new Ajv({ strict: false }); // Added strict false for handling of new ajv version

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
      stylesheets: [
        {
          content: staticTemplateRender.css.code,
        },
        {
          name: styleHashMap["default"],
        },
      ],
      markup: staticTemplateRender.html,
    };

    return renderingInfo;
  },
};
