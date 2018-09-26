const { execSync } = require('child_process');
const execa = require('execa');
const { join } = require('path');

function isYarnAvailable() {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = ({ to }) => {
    const command = isYarnAvailable ? 'yarnpkg' : 'npm';
    return execa(command, ['install'], { cwd: join(process.cwd(), to) });
};
