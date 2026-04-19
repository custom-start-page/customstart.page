var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');

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
}));

app.use(cookieParser());

app.use((req, res, next) => {
    if (typeof req.session.userId === 'undefined') {
        req.session.userId = uuid();
    }

    next();
});

// Set request-aware config so templates always use the correct domain.
app.use((req, res, next) => {
    const hostname = req.hostname;
    const matched = global.config.domains.find(d => hostname === d || hostname.endsWith('.' + d))
        || global.config.domains[0];
    const port = global.config.port;
    const portSuffix = global.config.dev ? ':' + port : '';
    res.locals.config = {
        ...global.config,
        domain: matched,
        portSuffix,
        fullDomain: '//' + matched + portSuffix,
    };
    next();
});

var vhost = require('vhost');

var mainApp = express();
var startApp = express();

global.config.domains.forEach(domain => {
    app.use(vhost(domain, mainApp));
    app.use(vhost('*.' + domain, startApp));
});

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
