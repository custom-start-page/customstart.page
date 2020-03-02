const express = require('express');
const path = require('path');
const fs = require('fs');

const logger = require('../logger.js');
const track =  require('../track.js');
const app = require('../app').start;

class Theme {
    constructor(themeName) {
        this.themeName = themeName;

        if (this.themeExists() === false) {
            throw "Theme does not exist.";
        }
    }
    themeExists() {
        return fs.existsSync('./pages/' + this.themeName);
    }
    getMeta() {
        const meta = JSON.parse(fs.readFileSync('./pages/' + this.themeName + '/manifest/meta.json', 'utf8'));

        return meta;
    }
    getSchema() {
        const schema = JSON.parse(fs.readFileSync('./pages/' + this.themeName + '/manifest/schema.json', 'utf8'));

        return schema;
    }
    getDefaultdata() {
        const data = JSON.parse(fs.readFileSync('./pages/' + this.themeName + '/manifest/defaultData.json', 'utf8'));

        return data;
    }
}

module.exports = function() {
    app.use('/js/shared/',  express.static('./public/js/shared/'));

    app.get('/edit', function (req, res, next) {
        // track.pageView(req);

        const themeName = req.vhost[0];
        const hideFooter = req.query.hideFooter == 'true' || false;

        res.render('edit', {
            layout: 'common',
            relativeUrl: '',
            hideFooter: hideFooter,
            metaDescription: `Edit the ${themeName} startpage.`,
            noindex: true,
        });
    });

    app.get('/preview', function (req, res, next) {
        track.pageView(req);

        const themeName = req.vhost[0];

        res.render('preview', {
            layout: 'common',
            relativeUrl: '',
            themeName: themeName,
            hideFooter: false,
            metaDescription: `Preview and edit the "${themeName}" startpage.`,
        });
    });

    // app.get('/', function (req, res, next) {
    //     track.pageView(req);

    //     const themeName = req.vhost[0];

    //     res.render('view', {
    //         layout: 'common',
    //         relativeUrl: '',
    //         themeName: themeName,
    //         hideFooter: true,
    //         noCruft: true,
    //     });
    // });

    function getFilePath(req) {
        if (req.params[0].length === 0) {
            return 'index.html';
        }

        let filePath = req.params[0];

        // if (filePath.startsWith('view') === false) {
        //     return filePath;
        // }

        // filePath = filePath.substring(5);

        // if (filePath.length === 0) {
        //     return 'index.html';
        // }

        return filePath;
    }

    app.get('/api/meta', function (req, res) {
        const themeName = req.vhost[0];
        const meta = new Theme(themeName).getMeta();

        res.json(meta);
    });

    app.get('/api/data', function (req, res) {
        const themeName = req.vhost[0];
        const userDataLocation = `./user-data/${req.session.userId}.json`;

        if (req.session.userId === false || fs.existsSync(userDataLocation) === false) {
            const defaultData = new Theme(themeName).getDefaultdata();

            res.json(defaultData);
        } else {
            const data = JSON.parse(fs.readFileSync(userDataLocation, 'utf8'));

            res.json(data);
        }
    });

    app.post('/api/data', function (req, res) {
        if (!req.session.userId) {
            return;
        }

        fs.writeFile(`./user-data/${req.session.userId}.json`, JSON.stringify(req.body, null, 4));

        res.send({
            message: 'Saved!'
        });
    });

    app.get('/api/schema', function (req, res) {
        const themeName = req.vhost[0];
        const schema = new Theme(themeName).getSchema();

        res.json(schema);
    });

    // Render startpage.
    app.get('/', function (req, res, next) {
        const themeName = req.vhost[0];

        track.pageView(req);

        const html = fs.readFileSync(global.config.basedir + '/pages/' + themeName + '/index.html');

        res.write(html);

        // Dirty inject.
        if (config.dev) {
            res.write(`<script src="//localhost/js/shared/inject.js"></script>`);
        } else {
            res.write(`<script src="/js/shared/inject.min.js"></script>`);
        }

        if (req.query.iframe !== 'true') {
            const ga = fs.readFileSync(global.config.basedir + '/views/partials/ga.ejs');

            res.write(ga);
        }

        res.end();
    });

    app.get('/*', function (req, res, next) {
        const themeName = req.vhost[0];
        const meta = new Theme(themeName).getMeta();
        const filePath = getFilePath(req);

        if (filePath === 'index.html' && req.query.iframe !== 'true') {
            track.pageView(req);
        }

        const root = path.join(
            global.config.basedir,
            'pages/' + themeName,
            // Dirty hack, should fix:
            filePath === 'preview.jpg' || filePath === 'preview.png'
                ? (meta.outputDir || '')
                : ''
        );

        // If the page has no favicon, send the default one.
        if (filePath === 'favicon.ico') {
            if (fs.existsSync(path.join(root + filePath)) === false) {
                const faviconPath = path.join(
                    global.config.basedir,
                    'public/favicon.ico'
                );

                res.sendFile(faviconPath, function(err) {
                    if (err)
                        next(err)
                });

                return;
            }
        }

        const options = {
            root: root,
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        res.sendFile(filePath, options, function(err) {
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
