const express = require('express');
const path = require('path');
const fs = require('fs');

const logger = require('../logger.js');
const track =  require('../track.js');
const app =  require('../app.js').main;

module.exports = function(page) {
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
            bodyText: page.bodyText,
            themes: themeManifests,
            metaDescription: page.metaDescription,
        });
    });
};
