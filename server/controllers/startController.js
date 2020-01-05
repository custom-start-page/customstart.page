const logger = require('../logger');
const express = require('express');
const app = require('../app').start;
const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');

module.exports = function() {
    app.use('/js/shared/',  express.static('./public/js/shared/'));

    app.get('/edit', function (req, res, next) {
        const themeName = req.vhost[0];
        const hideFooter = req.query.hideFooter == 'true' || false;

        const schema = fs.readFileSync('./pages/' + themeName + '/manifest/schema.json', 'utf8');

        res.render('edit', {
            layout: 'common',
            relativeUrl: '',
            schema: schema,
            themeName: themeName,
            hideFooter: hideFooter,
        });
    });

    app.get('/preview', function (req, res, next) {
        const themeName = req.vhost[0];

        res.render('preview', {
            layout: 'common',
            relativeUrl: '',
            themeName: themeName,
            hideFooter: false,
        });
    });

    app.get('/', function (req, res, next) {
        const themeName = req.vhost[0];

        res.render('view', {
            layout: 'common',
            relativeUrl: '',
            themeName: themeName,
            hideFooter: true,
            noCruft: true,
        });
    });

    function getFilePath(req) {
        if (req.params[0].length === 0) {
            return 'index.html';
        }

        let filePath = req.params[0];

        if (filePath.startsWith('view') === false) {
            return filePath;
        }

        filePath = filePath.substring(5);

        if (filePath.length === 0) {
            return 'index.html';
        }

        return filePath;
    }

    // Render startpage.
    app.get(['/*', '/view*'], function (req, res, next) {
        const themeName = req.vhost[0];
        const filePath = getFilePath(req);

        const options = {
            root: path.join(appDir, 'pages/' + themeName),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        res.sendFile(filePath, options, function (err) {
            if (err)
                next(err)
        });

        // if (filePath.endsWith('/') || filePath.includes('.')) {
        //     res.sendFile(filePath, options, function (err) {
        //         if (err)
        //             next(err)
        //     });
        // } else {
        //     res.redirect(req.url + '/');
        // }
    });
};
