const config = require('./server/config.json');

// Allows config to be used in .ejs files too.
global.config = config;
global.config.fullDomain = '//' + config.domain +
    (config.port === 80 || config.port === 443
        ? ''
        : ':' + config.port);
global.config.basedir = __dirname;

// Custom modules
const logger = require('./server/logger.js');
const app = require('./server/app.js').app;
require('./server/routing.js');

logger.info(global.config);

/////////////////
// Inititialise
/////////////////

if (config.type === 'node') {
    // Used for Node server.
    var server = app.listen(config.port, function () {
        const host = server.address().address;
        const port = server.address().port;

        logger.info(`Website listening at http://${host}:${port}.`);
    });
} else if (config.type === 'iis') {
    // Used for IISNode.
    app.listen(process.env.PORT);
} else {
    logger.error('Error: wrong config.type set');
}
