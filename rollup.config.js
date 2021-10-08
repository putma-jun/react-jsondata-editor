import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import {uglify} from 'rollup-plugin-uglify';


export default {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs'
    },
    {
      file: 'lib/index.esm.js',
      format: 'esm'
    },
  ],
  plugins: [
    postcss({
      modules: true
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: "runtime"
    }),
    commonjs(),
    uglify(),
  ],
  external: ['react']
}