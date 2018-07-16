'use strict';

const fs = require('fs');
const util = require('util');
const stat = util.promisify(fs.stat);
const gulp = require('gulp');
const {throttle} = require('lodash');
const {spawn, spawnSync} = require('child_process');
let nodeProcess;

let src = {
    code: ['./server/index.js', 'webpack.server.develop.js']
};

gulp.task('serverManager', serverManager);
gulp.task('buildDist', buildDist);
gulp.task('installPackages', installPackages);
gulp.task('develop', gulp.series('buildDist', 'serverManager'));

function buildDist(done) {
    spawnSync(
        './node_modules/.bin/webpack-cli',
        ['--display', 'normal', '--config', 'webpack.server.develop.js'],
        {stdio: 'inherit'}
    );
    if (done) done();
}

async function installPackages(done) {
    spawnSync('npm', ['install'], {
        stdio: 'inherit',
        cwd: './server/dist',
        shell: true
    });
    done();
}

function serverManager(done) {
    gulp.watch(
        src.code,
        {
            ignoreInitial: false,
            ignored: ['./dist', '**/*.spec.js', './src/common/node_modules']
        },
        throttle(reloadServer, 3000, {leading: true, trailing: false})
    );
    done();
    async function reloadServer(done) {
        if (nodeProcess) nodeProcess.kill();
        buildDist();
        nodeProcess = spawn('node', ['./server/dist/index.js'], {
            stdio: 'inherit'
        });
        nodeProcess.on('close', function(code) {
            if (code === 8) {
                gulp.log('Error detected, waiting for changes...');
            }
        });
        done();
    }
}
