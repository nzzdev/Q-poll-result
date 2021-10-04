const Boom = require("@hapi/boom");
const fs = require("fs");

const resourcesDir = `${__dirname}/../../resources/`;
const viewsDir = `${__dirname}/../../views/`;
const styleHashMap = require(`${__dirname}/../../styles/hashMap.json`);
const pollTypeInfos = require(`${resourcesDir}/helpers/pollTypeInfos.js`);

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(
  fs.readFileSync(`${resourcesDir}schema.json`, {
    encoding: "utf-8",
  })
);
const Ajv = require("ajv");
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

require("svelte/ssr/register");
const template = require(`${viewsDir}HtmlStatic.html`);

module.exports = {
  method: "POST",
  path: "/rendering-info/html-static",
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

    let renderingInfo = {
      stylesheets: [
        {
          name: styleHashMap.default,
        },
      ],
      markup: template.render(context),
    };
    return renderingInfo;
  },
};
