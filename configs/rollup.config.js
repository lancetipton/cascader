import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import sourcemaps from 'rollup-plugin-sourcemaps';

const outputFile = "./build/index"

export default {
  input: "./src/index.js",
  output: [
    {
      file: `${outputFile}.es.js`,
      format: "es",
    },
    {
      file: `${outputFile}.cjs.js`,
      format: "cjs",
    },
  ],
  external: ['react', 'react-native', '@keg-hub/jsutils' ],
  watch: {
    clearScreen: false
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify('production')
    }),
    resolve(),
    babel({ 
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react']
    }),
    sourcemaps(),
    commonjs(),
    cleanup(),
  ],
}