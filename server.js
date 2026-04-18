require('dotenv').config();

global.config = {
    domains: process.env.DOMAINS.split(',').map(d => d.trim()),
    port: parseInt(process.env.PORT),
    useServiceWorker: process.env.USE_SERVICE_WORKER === 'true',
    dev: process.env.DEV === 'true',
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
