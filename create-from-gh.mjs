#!/usr/bin/env node
import {create_from_gh} from './from-gh.mjs'

function main([from, to]) {
  create_from_gh({from, to})
    .catch(err => {
      console.log(err.message)
      process.exit(1)
    })
}

main(process.argv.slice(2))
