const express = require('express');
const request = require('request');

const app =  require('./app.js').main;
const logger = require('./logger.js');
const config = require('./config.json');

const routing = function() {
    // Render index.
    app.get('/', function(req, res) {
        const themes = [
            {
                "name": "Minimal Viable Startpage",
                "slug": "minimum-viable-startpage",
                "author": {
                    "name": "0-Tikaro",
                    "link": "https://github.com/0-Tikaro/minimum-viable-startpage"
                }
            },
            {
                "name": "Tilde Enhanced",
                "slug": "tilde-enhanced",
                "author": {
                    "name": "Ozencb",
                    "link": "https://github.com/Ozencb/tilde-enhanced"
                }
            },
            {
                "name": "Sui",
                "slug": "sui",
                "author": {
                    "name": "jeroenpardon",
                    "link": "https://github.com/jeroenpardon/sui/"
                }
            },
        ];

        res.render('index', {
            layout: 'common',
            relativeUrl: '',
            themes: themes,
        });
    });

    require('./controllers/startController.js')();

    /////////////////
    // Statuses
    /////////////////
    app.use(express.static('./public'));

    /////////////////
    // Statuses
    /////////////////

    if (config.dev == true) {
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
