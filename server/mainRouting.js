const express = require('express');
const fs = require('fs');

const app =  require('./app.js').main;
const track =  require('./track.js');
const logger = require('./logger.js');
const config = require('./config.json');

const routing = function() {
    // Render index.
    app.get('/', function(req, res) {
        track.pageView(req);

        const dirs = fs.readdirSync(global.config.basedir + '/pages');

        const themeManifests = dirs
            .map(dirPath => global.config.basedir + '/pages/' + dirPath + '/manifest/meta.json')
            .filter(fullDirPath => fs.existsSync(fullDirPath))
            .map(fullDirPath => {
                const json = JSON.parse(fs.readFileSync(fullDirPath));

                return json;
            });

        res.render('index', {
            layout: 'common',
            relativeUrl: '',
            themes: themeManifests,
            metaDescription: 'Choose from a variety of homepage themes and customise it to your needs.',
        });
    });

    require('./controllers/startController.js')();

    /////////////////
    // Static
    /////////////////
    app.use(express.static('./public'));

    if (config.dev == true) {
        app.use(express.static('./src'));
    }

    /////////////////
    // Statuses
    /////////////////

    app.use(function(req, res, next) {
        track.pageView(req);

        logger.info('404 error: %s', req.originalUrl);

        res.status(404).render('error', {
            layout: 'common',
            relativeUrl: '404',
            pageTitle: 'Status: 404',
            bodyText: '<p>You\'re looking for a page that doesn\'t exist...</p>',
            metaDescription: "This page doesn't seem to exist.",
        });
    });

    app.use(function(err, req, res, next) {
        track.pageView(req);

        logger.error('500 error: %s', err.stack);

        res.status(500).render('error', {
            layout: 'common',
            relativeUrl: '500',
            pageTitle: 'Status: 500',
            bodyText: '<p>So sorry, but a problem occured! Please email me if this problem persists.</p>',
            metaDescription: "This page has errored.",
        });
    });
}();

module.exports = routing;
