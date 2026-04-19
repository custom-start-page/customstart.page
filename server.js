require('dotenv').config();

global.config = {
    domains: process.env.DOMAINS
        ? process.env.DOMAINS.split(',').map(d => d.trim())
        : (() => { throw new Error('DOMAINS env var is required'); })(),
    port: process.env.PORT
        ? parseInt(process.env.PORT)
        : (() => { throw new Error('PORT env var is required'); })(),
    useServiceWorker: process.env.USE_SERVICE_WORKER
        ? process.env.USE_SERVICE_WORKER === 'true'
        : (() => { throw new Error('USE_SERVICE_WORKER env var is required'); })(),
    dev: process.env.DEV
        ? process.env.DEV === 'true'
        : (() => { throw new Error('DEV env var is required'); })(),
    basedir: __dirname,
};

// Custom modules
const logger = require('./server/logger.js');
const app = require('./server/app.js').app;
require('./server/routing.js');

logger.info(global.config);

/////////////////
// Inititialise
/////////////////

var server = app.listen(global.config.port, function () {
    const host = server.address().address;
    const port = server.address().port;

    logger.info(`Website listening at http://${host}:${port}.`);
});
