const logger = require('../logger');
const app = require('../app').start;
const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');

logger.info(app);

module.exports = function() {
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
        });
    });

    // Render startpage.
    app.get('/*', function (req, res, next) {
        const themeName = req.vhost[0];
        const filePath = req.params[0] || 'index.html';

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
