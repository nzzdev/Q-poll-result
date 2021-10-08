// This file has to use common.js syntax
const sveltePreprocess = require("svelte-preprocess");

const sassPreprocessor = sveltePreprocess.sass({
  includePaths: ["./styles_src"],
  //includePaths: [path.join(__dirname, "/styles_src/")], // These styles will be loaded before any .svelte styles
  outFile: "./styles/default.css",
  //outFile: path.join(__dirname, "/styles/default.css"),
  outputStyle: "compressed",
  renderSync: true,
  // TODO: Check sourcemap extraction of svelte-preprocess, currently use hashmap of css only
  //sourceMap: true,
  //sourceMapEmbed: true,
});

// Preprocessor needed for 'Svelte for VS Code' to understand sass inside .svelte files
function createPreprocessor() {
  return sveltePreprocess({
    sass: sassPreprocessor,
  });
}

function createSassPreprocessor() {
  return sassPreprocessor;
}

module.exports = {
  preprocess: createPreprocessor(), // Export for 'Svelte for VS Code'
  sassPreprocessor: createSassPreprocessor(),
};
