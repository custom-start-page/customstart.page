const data =  require('../data.js');

const logger = require('../logger.js');
const app = require('../app').main;

module.exports = function() {
    app.get('/api/tracking/status', function (req, res) {
        res.json(req.session.disableTracking ? "disabled" : "enabled");
    });

    app.get('/api/tracking/disable', function (req, res) {
        req.session.disableTracking = true;

        res.json("done");
    });

    app.get('/api/tracking/enable', function (req, res) {
        req.session.disableTracking = false;

        res.json("done");
    });
};
