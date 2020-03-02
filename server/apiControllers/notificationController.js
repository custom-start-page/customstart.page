const data =  require('../data.js');

const logger = require('../logger.js');
const app = require('../app').main;

module.exports = function() {
    app.get('/api/notifications/', function (req, res) {
        const news = data().news
            .sort(newsItem => new Date(newsItem.date));

        res.json(news);
    });
};
