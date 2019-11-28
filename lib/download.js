const { join: path_join } = require('path')
const finished = require('util').promisify(require('stream').finished)
const got = require('got')
const tar = require('tar')

async function gh_download({ from, to, owner, repo, branch, src_path }) {
  if (!branch) branch = 'master'
  src_path = src_path ? src_path.split('/') : []

  const gh_url = `https://codeload.github.com/${owner}/${repo}/tar.gz/${branch}`

  const stream = await got.stream(gh_url)
  const sp = finished( stream )

  const out_path = path_join(`${repo}-${branch}`, ...src_path)
  const tar_pipe = tar.extract( { cwd: to, strip: src_path.length + 1 }, [ out_path ])

  const untar_stream = stream.pipe(tar_pipe)
  await finished( stream )
  await finished( untar_stream )
}

module.exports = { gh_download }
