var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');

const config = require('./config.json');
const uuid = require('./uuid');

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const bodyParser = require('body-parser')
const logger = require('./logger.js');

var app = express();

app.use(cookieSession({
    name: 'session',
    secret: '2a30fce7-9188-4747-92df-2959fc35b4c2',

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 * 365, // 365 days
    // Sets `HostOnly` to false: https://stackoverflow.com/questions/12387338/what-is-a-host-only-cookie
    // So subdomains can share cookies.
    // Though this won't work with localhost and subdomains :(
    domain: config.domain,
}));

app.use(cookieParser());

app.use((req, res, next) => {
    if (typeof req.session.userId === 'undefined') {
        req.session.userId = uuid();
    }

    // logger.info(req.subdomains, req.originalUrl, req.session.userId);
    // logger.info(req.session.userId);

    next();
});

var vhost = require('vhost');

var mainApp = express();
var startApp = express();

app.use(vhost(config.domain, mainApp));
app.use(vhost('*.' + config.domain, startApp));

// Parse application/x-www-form-urlencoded
startApp.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
startApp.use(bodyParser.json())

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
