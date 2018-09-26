const got = require('got');
const tar = require('tar');

module.exports = ({ from, to }) => {
    const [username, repo, ...path] = from.split('/');

    return new Promise((resolve, reject) => {
        got
            .stream(`https://codeload.github.com/${username}/${repo}/tar.gz/master`)
            .on('error', reject)
            .pipe(
                tar.extract(
                    {
                        cwd: to,
                        strip: path.length + 1,
                    },
                    [
                        `${repo}-master/${path.join('/')}`,
                    ]
                )
            )
            .on('error', reject)
            .on('end', () => resolve());
    });
};
