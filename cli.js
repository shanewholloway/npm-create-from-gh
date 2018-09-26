const mkdir = require('make-dir');
const download = require('./lib/download');
const install = require('./lib/install');

const [from, to] = process.argv.slice(2);

if (!from || !to) {
    console.log('Path for source and name for destination directory is required!');
    process.exit(1);
}

mkdir(to)
    .then(download({ from, to }))
    .then(install({ to }));
