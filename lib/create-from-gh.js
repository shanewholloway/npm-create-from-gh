const fsp = require('fs').promises
import gh_download from './download.js'

export function default_argv(args) {
  const [from, to] = process.argv.slice(2, 4)
  return {from, to}
}

export function unpack_github_from(from) {
  const [from0, branch] = from.split('#')
  const [owner, repo, ...src_parts] = from0.split('/')
  const src_path = src_parts.join('/') || undefined
  return {owner, repo, branch, src_path, src_parts}
}

export const mkdir = to =>
  fsp.mkdir(to)
    .catch(err => { if ('EEXIST' != err.code) throw err })

export async function create_from_gh({from, to} = default_argv()) {
  if (!from) throw new Error('GitHub <owner>/<repo> required as first argument')

  const info = unpack_github_from(from)
  if (!to) to = info.repo + (! info.src_path ? '' : '--'+info.src_parts.slice(-1)[0])

  console.log(`Templating from GitHub:`, {from, to, info})

  await mkdir(to, {recursive: true})
  await gh_download({ from, to, ...info })
}

export { create_from_gh as main }

