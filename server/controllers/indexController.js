const express = require('express');
const path = require('path');
const fs = require('fs');

const logger = require('../logger.js');
const app =  require('../app.js').main;
const Theme = require('../models/Theme.js');

module.exports = function(page) {
    app.get('/', function(req, res) {
        const dirs = fs.existsSync(global.config.basedir + '/pages')
            ? fs.readdirSync(global.config.basedir + '/pages')
            : [];

        const themes = dirs
            .map(dirPath => new Theme(dirPath));

        res.render('index', {
            layout: 'common',
            relativeUrl: '',
            help: page.help,
            faq: page.faq,
            themes: themes,
            metaDescription: page.metaDescription,
        });
    });
};
