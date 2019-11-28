#!/usr/bin/env node

const fsp = require('fs').promises
const { gh_download } = require('./lib/download.js')
// const { install_all } = require('./lib/install.js')

function default_argv(args) {
  const [from, to] = process.argv.slice(2, 4)
  return {from, to}
}

function unpack_github_from(from) {
  const [from0, branch] = from.split('#')
  const [owner, repo, ...src_parts] = from0.split('/')
  const src_path = src_parts.join('/') || undefined
  return {owner, repo, branch, src_path, src_parts}
}

const mkdir = to =>
  fsp.mkdir(to)
    .catch(err => { if ('EEXIST' != err.code) throw err })

async function create_from_gh({from, to} = default_argv()) {
  if (!from) throw new Error('GitHub <owner>/<repo> required as first argument')

  const info = unpack_github_from(from)
  if (!to) to = info.repo + (! info.src_path ? '' : '--'+info.src_parts.slice(-1)[0])

  console.log(`Templating from GitHub:`, {from, to, info})

  await mkdir(to, {recursive: true})
  await gh_download({ from, to, ...info })

  if (false) {
    // auto-installing dependencies doesn't save much time and opens security concerns
    // await install_all({ to, ...info })
  }
}


Object.assign(exports, {
  create_from_gh, main: create_from_gh,
  unpack_github_from, default_argv,
})

if (module === require.main) {
  const [from, to] = process.argv.slice(2)
  create_from_gh({ from, to })
    .catch(err => {
      console.log(err.message)
      process.exit(1)
    })
}

