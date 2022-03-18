import {builtinModules} from 'module'
import rpi_resolve from '@rollup/plugin-node-resolve'
import rpi_commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json' // allow use of Node CommonJS modules without Rollup in the middle
pkg.dependencies ||= {} // ensure a dependencies dict

const _cfg_ = {
  external: id => (
       /^\w+:/.test(id)
    || builtinModules.includes(id)
    || !! pkg.dependencies[id] // allow use of Node CommonJS modules without Rollup in the middle
    ),
  plugins: [
    rpi_resolve({preferBuiltins: true}),
    rpi_commonjs({}),
  ]}

export default [
  ... add('create-from-gh'),
  ... add('download'),
]


function * add(name) {
  yield ({ ..._cfg_, input: `lib/${name}.js`, output: [
      { file: `cjs/${name}.js`, format: 'cjs', exports:'named' },
      { file: `esm/${name}.mjs`, format: 'es' }, ]})
}
