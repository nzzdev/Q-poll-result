const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const production = !process.env.ROLLUP_WATCH;
const postcssPlugins = [autoprefixer];

if (production) {
  postcssPlugins.push(cssnano);
}

const config = {
  outputStyle: "compressed",
  sourceMap: !production,
  sourceMapEmbed: !production,
  failOnError: !production,
};

const rollup = {
  ...config,
  outFile: path.join(__dirname, "/styles/default.css"),
  watch: [path.join(__dirname, "/styles_src"), path.join(__dirname, "/views")],
  processor: (css) =>
    postcss(postcssPlugins)
      .process(css)
      .then((result) => result.css),
  output: outputCss,
};

const node = {
  ...config,
  includePaths: [path.join(__dirname, "/styles_src")],
};

function outputCss(styles, styleNodes) {
  const stylesDir = "styles";

  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir);
  }

  fs.writeFileSync(`styles/default.css`, styles);
}

module.exports = { node, rollup, postcssPlugins };
