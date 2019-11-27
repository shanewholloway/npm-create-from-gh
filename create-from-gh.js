#!/usr/bin/env node

const fsp = require('fs').promises
const { gh_download } = require('./lib/download.js')
const { install_all } = require('./lib/install.js')

function default_argv(args) {
  const [from, to] = process.argv.slice(2, 4)
  return {from, to}
}

function unpack_github_from(from) {
  let [owner, repo_full, ...src_path] = from.split('/')
  let [repo, branch] = repo_full.split('#')
  src_path = src_path.join('/') || undefined
  return {owner, repo, branch, src_path}
}

async function create_from_gh({from, to} = default_argv()) {
  if (!from) throw new Error('GitHub <username>/<repo> required as first argument')

  const opt = unpack_github_from(from)
  if (!to) to = opt.repo

  console.log(`Templating from GitHub:`, {to, from, ...opt})

  try {
    await fsp.mkdir(to)
  } catch (err) {
    if ('EEXIST' != err.code) throw err
  }

  await gh_download({ from, to, ...opt })
  await install_all({ to, ...opt })
}


Object.assign(exports, {
  create_from_gh, main: create_from_gh,
  unpack_github_from, default_argv,
})

if (module === require.main) {
  const [from, to] = process.argv.slice(2)
  create_from_gh({ from, to })
}

