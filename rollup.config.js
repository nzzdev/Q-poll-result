import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

const scriptsDir = path.join(__dirname, "./scripts_src/");

function writeHashmap(hashmapPath, file, fileext) {
  const hash = crypto.createHash("md5");
  hash.update(file.content, { encoding: "utf8" });
  file.hash = hash.digest("hex");

  const hashMap = {};
  hashMap[file.name] = `${file.name}.${file.hash.substring(0, 8)}.${fileext}`;
  fs.writeFileSync(hashmapPath, JSON.stringify(hashMap));
}

function generateHashmap() {
  return {
    name: "generateHashmap",
    async generateBundle(outputOptions, bundle, isWrite) {
      const scriptsDir = "scripts";
      // Create directory if not yet exist or recreate directory if it already exists
      if (!fs.existsSync(scriptsDir)) {
        fs.mkdirSync(scriptsDir);
      } else {
        fs.rmdirSync(scriptsDir, { recursive: true });
        fs.mkdirSync(scriptsDir);
      }
      writeHashmap(
        "scripts/hashMap.json",
        {
          name: filename,
          content: bundle[`${filename}.js`].code,
        },
        "js"
      );
    },
  };
}

const filename = "default";
export default {
  input: `${scriptsDir}${filename}.js`,
  output: {
    format: "iife",
    name: "window._q_scroll_graphic.ScrollGraphic",
    file: `scripts/${filename}.js`,
  },
  plugins: [
    svelte(),
    css({
      output: function (styles, styleNodes) {
        const stylesDir = "styles";
        // Create directory if not yet exist or recreate directory if it already exists
        if (!fs.existsSync(stylesDir)) {
          fs.mkdirSync(stylesDir);
        } else {
          fs.rmdirSync(stylesDir, { recursive: true });
          fs.mkdirSync(stylesDir);
        }
        fs.writeFileSync(`styles/${filename}.css`, styles);
        writeHashmap(
          "styles/hashMap.json",
          {
            name: filename,
            content: styles,
          },
          "css"
        );
      },
    }),
    nodeResolve({ browser: true }),
    commonjs(),

    // Watch the `scripts` directory and refresh the
    // browser on changes when not in production
    !production && livereload({ watch: "scripts", delay: 800 }),

    // If we're building for production transpile and minify
    production &&
      buble({
        transforms: {
          dangerousForOf: true,
        },
      }),
    production && terser(),
    generateHashmap(),
  ],
  watch: {
    clearScreen: false,
  },
  onwarn: function (warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
