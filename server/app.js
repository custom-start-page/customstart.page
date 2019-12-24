const config = require('./config.json');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const cors = require('cors');
// const logger = require('./logger.js');

var app = express();

var vhost = require('vhost');

var mainApp = express();
var startApp = express();

app.use(vhost(config.domain, mainApp));
app.use(vhost('*.' + config.domain, startApp));

mainApp.use(compression());
startApp.use(compression());

mainApp.use(cors());

mainApp.set('view engine', 'ejs');
startApp.set('view engine', 'ejs');

mainApp.use(expressLayouts);
startApp.use(expressLayouts);

module.exports = {
    app: app,
    main: mainApp,
    start: startApp,
};
