import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'

const outputFile = "./build/index.js"

export default {
  input: "./src/index.js",
  output: {
    file: outputFile,
    format: "cjs"
  },
  external: id => /^react/.test(id),
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify('production')
    }),
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    cleanup(),
    commonjs()
  ],
}