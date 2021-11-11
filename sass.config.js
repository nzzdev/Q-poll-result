const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const nodeConfig = {
  includePaths: [path.join(__dirname, "/styles_src")],
};

function getRollupConfig(isProduction) {
  return {
    outFile: path.join(__dirname, "/styles/default.css"),
    watch: [
      path.join(__dirname, "/styles_src"),
      path.join(__dirname, "/views"),
    ],
    processor: (css) =>
      postcss(getPostcssPlugins(isProduction))
        .process(css)
        .then((result) => result.css),
    output: outputCss,
  };
}

function outputCss(styles, styleNodes) {
  const stylesDir = "styles";

  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir);
  }

  fs.writeFileSync(`styles/default.css`, styles);
}

function getPostcssPlugins(isProduction) {
  const postcssPlugins = [autoprefixer];

  if (isProduction) {
    postcssPlugins.push(cssnano);
  }

  return postcssPlugins;
}

function getConfig(origin, isProduction) {
  const config = {
    outputStyle: isProduction ? "compressed" : "expanded",
    sourceMap: !isProduction,
    sourceMapEmbed: !isProduction,
    failOnError: !isProduction,
  };

  if (origin === "node") {
    return { ...config, ...nodeConfig };
  } else if (origin === "rollup") {
    return { ...config, ...getRollupConfig(isProduction) };
  } else {
    console.error(`Unsupported origin: '${origin}'.`);
  }
}

module.exports = { getConfig, getPostcssPlugins };
