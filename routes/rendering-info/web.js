const Boom = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const sass = require("sass");
const postcss = require("postcss");
const sassConfig = require("./../../sass.config");

const viewsDir = `${__dirname}/../../views/`;
const stylesSrcDir = path.join(__dirname, "/../../styles_src/");
const resourcesDir = `${__dirname}/../../resources/`;
const mainSassFilePath = path.join(stylesSrcDir, "/main.scss");

const production = !process.env.ROLLUP_WATCH;

require("svelte/register");
const staticTemplate = require(viewsDir + "App.svelte").default;
const pollTypeInfos = require(`${resourcesDir}/helpers/pollTypeInfos.js`);

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

async function processSass(entryPath, isProduction) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: entryPath,
        ...sassConfig.getConfig("node", isProduction),
      },
      (err, result) => {
        if (err) {
          reject("failed to compile stylesheet with 'sass.render'", err);
          process.exit(1);
        }

        return postcss(sassConfig.getPostcssPlugins(isProduction))
          .process(result.css, { from: undefined })
          .then((postcssResult) => resolve(postcssResult))
          .catch((error) => {
            reject(
              "failed to compile stylesheet with 'postcss.process'",
              error
            );
            process.exit(1);
          });
      }
    );
  });
}

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
    const processedSass = await processSass(mainSassFilePath, production);

    const renderingInfo = {
      stylesheets: [
        {
          content: processedSass.css,
        },
      ],
      markup: staticTemplateRender.html,
    };

    return renderingInfo;
  },
};
