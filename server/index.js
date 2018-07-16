'use strict';

require('babel-polyfill');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
setup().then(server => {
    return server.listen(9001, function() {
        console.log(`${server.name} listening at ${server.url}`);
    });
});

function setup() {
    return Promise.resolve().then(() => {
        const origins = ['*'];
        const cors = corsMiddleware({
            preflightMaxAge: 5,
            origins: origins,
            allowHeaders: [],
            exposeHeaders: []
        });

        const server = restify.createServer();
        server.name = 'fake-server';
        server.pre(cors.preflight);
        server.use(cors.actual);
        server.use(restify.plugins.bodyParser());
        server.post('/upload', upload);
        return server;
    });
}

function upload(req, res, next) {
    // console.log(req.body);
    // console.log('');
    console.log('***************************');
    console.log('******* req.headers *******');
    console.log(req.headers);
    console.log('');
    console.log('******* req.files *********');
    console.log(req.files);
    console.log('');
    console.log('');
    console.log('');
    res.send(200, {});
    return next();
}
