import { join as path_join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { finished } from 'node:stream/promises';

import got from 'got'
import * as tar from 'tar'


export async function gh_download({ from, to, owner, repo, branch, src_path }) {
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

export function unpack_github_from(from) {
  const [from0, branch] = from.split('#')
  const [owner, repo, ...src_parts] = from0.split('/')
  const src_path = src_parts.join('/') || undefined
  return {owner, repo, branch, src_path, src_parts}
}

export async function create_from_gh({from, to}) {
  if (!from) throw new Error('GitHub <owner>/<repo> required as first argument')

  const info = unpack_github_from(from)
  if (!to) to = info.repo + (! info.src_path ? '' : '--'+info.src_parts.slice(-1)[0])

  console.log(`Templating from GitHub:`, {from, to, info})

  await mkdir(to, {recursive: true})
  await gh_download({ from, to, ...info })
}

