import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import packageJson from "./package.json" with { type: "json" };

const peerDependencies = Object.keys(packageJson.peerDependencies);

export default {
  input: "src/index.ts", // Entry point of your library
  external: peerDependencies,
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.mjs",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react", "@babel/preset-typescript"],
      babelHelpers: "bundled",
    }),
    terser(),
    postcss({
      inject: true,
      minimize: true,
    }),
  ],
};
