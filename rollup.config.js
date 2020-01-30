import rpi_resolve from '@rollup/plugin-node-resolve'
import rpi_commonjs from '@rollup/plugin-commonjs'

const configs = []
export default configs

const external = [
  ... require('module').builtinModules,
]
const plugins = [
  rpi_resolve({preferBuiltins: true}),
  rpi_commonjs({}),
]

add('create-from-gh')
add('download')


function add(name) {
  configs.push({
    input: `lib/${name}.js`,
    output: [
      { file: `cjs/${name}.js`, format: 'cjs', exports:'named' },
      { file: `esm/${name}.mjs`, format: 'es' },
    ],
    plugins, external  })
}
