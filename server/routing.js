const express = require('express');

const app =  require('./app.js').main;
const logger = require('./logger.js');
const data = require('./data.js');
const config = require('./config.json');

const setupController = (page) => {
    try {
        require('./controllers/' + page.controller + 'Controller.js')(page);
    } catch (e) {
        logger.error('Failed to render page with name: ' + page.name, e);
    }
};

const setupControllers = (obj) => {
    for (let key of Object.keys(obj)) {
        var page = obj[key];

        /*
            if (!helpers.isObject(page)) {
                continue;
            }
        */

        if (typeof page.controller !== 'undefined') {
            setupController(page);
        }

        if (typeof page.children !== 'undefined' && page.children.length > 0) {
            setupControllers(page.children);
        }
    }
};

const routing = function() {
    setupControllers(data());

    require('./apiControllers/notificationController.js')();

    require('./controllers/startPageController.js')();

    /////////////////
    // Static files
    /////////////////
    app.use(express.static('./public'));

    // Just used for verifying SSL with Let's Encrypt.
    app.use('/.well-known', express.static('./.well-known'));

    if (config.dev == true) {
        app.use(express.static('./src'));
    }

    /////////////////
    // Statuses
    /////////////////

    app.use(function(req, res, next) {
        logger.info('404 error: %s', req.originalUrl);

        res.status(404).render('page', {
            layout: 'common',
            relativeUrl: '404',
            pageTitle: 'Status: 404',
            bodyText: '<p>You\'re looking for a page that doesn\'t exist...</p>',
            metaDescription: "This page doesn't seem to exist.",
        });
    });

    app.use(function(err, req, res, next) {
        logger.error('500 error: %s', err.stack);

        res.status(500).render('page', {
            layout: 'common',
            relativeUrl: '500',
            pageTitle: 'Status: 500',
            bodyText: '<p>So sorry, but a problem occured! Please email me if this problem persists.</p>',
            metaDescription: "This page has errored.",
        });
    });
}();

module.exports = routing;
