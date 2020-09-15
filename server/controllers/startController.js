const express = require('express');
const path = require('path');
const fs = require('fs');

const cheerio = require('cheerio');

const logger = require('../logger.js');
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
    /**
     * Get the HTML for the start page.
     * @param {boolean} withAnalytics If the HTML should include analytics.
     * @returns {string}
     */
    getIndexHtml(withAnalytics) {
        const meta = this.getMeta();
        const root = this.getPath();
        const html = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');

        const $ = cheerio.load(html);

        // Change meta for SEO.
        {
            // Remove existing meta.
            $('head title').replaceWith('<!-- Removed custom title -->');
            $('head meta[name="description"]').replaceWith('<!-- Removed custom meta description. -->');

            // Ensure the page always targets the top (if loaded in an iframe).
            $('head').append('<base target="_top">\r\n');

            // Add my meta.
            $('head').append('<!-- Meta injected by Custom Start Page for SEO purposes -->\r\n');
            $('head').append(`<title>${meta.name} | Custom Start Page</title>\r\n`);
            $('head').append(`<meta name="description" content="${meta.name} is a free, open source and customisable start page for your browser, hosted by Custom Start Page.">\r\n`);
        }

        // Dirty inject.
        if (config.dev) {
            $('body').append(`<script src="//localhost/js/shared/inject.js"></script>`);
        } else {
            $('body').append(`<script src="/js/shared/inject.min.js"></script>`);
        }

        if (withAnalytics) {
            const analyticsInject = fs.readFileSync(global.config.basedir + '/views/partials/analytics.ejs', 'utf-8');

            $('body').append(analyticsInject);
        }

        return $.html();
    }
    getPath() {
        return path.join(
            global.config.basedir,
            'pages',
            this.themeName,
            this.getMeta().outputDir || ''
        );
    }
}

module.exports = function() {
    app.use('/js/shared/',  express.static('./public/js/shared/'));

    app.get('/edit', function (req, res, next) {
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

    app.get('/manifest/*', (req, res, next) => {
        const themeName = req.vhost[0];
        const meta = new Theme(themeName).getMeta();
        const filePath = getFilePath(req);

        const root = path.join(
            global.config.basedir,
            'pages',
            themeName,
            'manifest'
        );

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
    });

    app.get('/*', (req, res, next) => {
        const themeName = req.vhost[0];
        const theme = new Theme(themeName);
        const meta = theme.getMeta();
        const filePath = getFilePath(req);

        const root = theme.getPath();

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

        if (filePath === 'index.html' && req.query.iframe !== 'true') {
            var withAnalytics = req.query.iframe !== 'true';
            var html = theme.getIndexHtml(withAnalytics);

            res.send(html);
        } else {
            res.sendFile(filePath, options, function(err) {
                if (err)
                    next(err)
            });
        }

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
