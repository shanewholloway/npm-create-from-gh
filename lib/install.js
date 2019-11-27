const fsp = require('fs').promises
const { inspect } = require('util')
const { join: path_join } = require('path')
const child_process = require('child_process')

async function npm_install({ to }) {
  if (await sential_absent(to, 'package.json'))
    return;

  await shell_spawn('npm install .', { to })
}

async function cargo_install({ to }) {
  if (await sential_absent(to, 'cargo.toml'))
    return;

  to = path_join(process.cwd(), to)
  await shell_spawn('cargo install .', { to })
}

async function install_all(...args) {
  await npm_install(...args)
  await cargo_install(...args)
}



function shell_spawn(command, opt) {
  let {to} = opt
  if (to) {
    opt.cwd = to = path_join(process.cwd(), to)
    delete opt.to
  }

  console.log(`\nShell spawn: ${inspect(command, {colors:true})}`)
  return new Promise((resolve, reject) =>
    child_process.spawn(command, {shell: true, stdio: 'inherit', ...opt})
    .on('close', code => code ? reject(code) : resolve())
    .on('exit', code => code ? reject(code) : resolve())
    .on('error', reject) )
}

async function sential_absent(to, filename) {
  try {
    const ans = await fsp.stat(path_join(to, filename))
    return false
  } catch (err) {
    if ('ENOENT' != err.code) throw err
    return true
  }
}


module.exports = {
  install_all,
  npm_install,
  cargo_install,

  shell_spawn,
  sential_absent,
}
