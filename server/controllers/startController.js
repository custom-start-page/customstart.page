const logger = require('../logger');
const app = require('../app');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');

module.exports = function() {
    app.get('/start/:name/edit', function (req, res, next) {
        const name = req.params.name;

        const schema = fs.readFileSync('./pages/' + name + '/manifest/schema.json', 'utf8');

        res.render('edit', {
            layout: 'common',
            relativeUrl: '',
            schema: schema,
            themeName: name,
        });
    });

    // Render startpage.
    app.get('/start/*', function (req, res, next) {
        const options = {
            root: path.join(appDir, 'pages'),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        const filePath = req.params[0];

        logger.info(filePath);

        res.sendFile(filePath, options, function (err) {
            if (err)
                next(err)
        });
    });
};
