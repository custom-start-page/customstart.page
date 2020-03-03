const ua = require('universal-analytics');

const config = require('./config.json');
const logger = require('./logger.js');

const track = function() {
    const pageView = function(req) {
        logger.info('Track pageview:', {
            path: req.originalUrl,
            base: req.protocol + '://' + req.headers.host,
            gaId: config.gaId,
            userId: req.session.userId,
            trackingDisabled: req.session.disableTracking,
        });

        if (config.gaId && req.session.userId && req.session.trackingDisabled !== true) {
            const visitor = ua(config.gaId, req.session.userId);

            visitor
                .pageview(req.originalUrl, req.protocol + '://' + req.headers.host)
                .send();
        }
    };

    return {
        pageView: pageView,
    };
};

module.exports = track();
