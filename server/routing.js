const express = require('express');
const request = require('request');

const app =  require('./app.js');
const logger = require('./logger.js');
const config = require('./config.json');

// Required dependencies:
// app, express, config, logger
const routing = function(dependencies) {
    for (let key in dependencies) {
        global[key] = dependencies[key];
    }

    // Render index.
    app.get('/', function(req, res) {
        res.render('index', {
            layout: 'common',
            relativeUrl: '',
        });
    });

    require('./controllers/startController.js')();
    /////////////////
    // Statuses
    /////////////////
    app.use(express.static('./public'));
    app.use(express.static('./pages'));

    /////////////////
    // Statuses
    /////////////////

    if(global.config.dev == true) {
        app.use(express.static('./src'));
    }

    app.use(function(req, res, next) {
        logger.info('404 error: %s', req.originalUrl);

        res.status(404).render('error', {
            layout: 'common',
            relativeUrl: '404',
            pageTitle: 'Status: 404',
            bodyText: '<p>You\'re looking for a page that doesn\'t exist...</p>',
        });
    });

    app.use(function(err, req, res, next) {
        logger.error('500 error: %s', err.stack);

        res.status(500).render('error', {
            layout: 'common',
            relativeUrl: '500',
            pageTitle: 'Status: 500',
            bodyText: '<p>So sorry, but a problem occured! Please email me if this problem persists.</p>',
        });
    });
}();

module.exports = routing;
