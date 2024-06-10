const { series } = require('gulp');
const { exec } = require('child_process');

function installDeps(cb) {
  exec('npm install react react-dom axios', (err, stdout, stderr) => {
    // eslint-disable-next-line no-console
    console.log(stdout);
    // eslint-disable-next-line no-console
    console.error(stderr);
    cb(err);
  });
}

exports.default = series(installDeps);
