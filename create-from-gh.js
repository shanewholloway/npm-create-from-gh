#!/usr/bin/env node
const {create_from_gh} = require('./cjs/create-from-gh.js')

const [from, to] = process.argv.slice(2)
create_from_gh({ from, to })
  .catch(err => {
    console.log(err.message)
    process.exit(1)
  })
