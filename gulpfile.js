const { series } = require('gulp');
const { exec } = require('child_process');

function installDeps(cb) {
  exec('npm install react react-dom axios', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
}

exports.default = series(installDeps);
