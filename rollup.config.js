import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import sourcemaps from 'rollup-plugin-sourcemaps';

const outputFile = "./build/index.js"

export default {
  input: "./src/index.js",
  output: {
    file: outputFile,
    format: "cjs"
  },
  watch: {
    clearScreen: false
  },
  external: ['react', 'jsutils' ],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify('production')
    }),
    babel({
      exclude: "node_modules/**",
      presets: ['@babel/env', '@babel/preset-react']
    }),
    sourcemaps(),
    resolve(),
    cleanup(),
    commonjs()
  ],
}