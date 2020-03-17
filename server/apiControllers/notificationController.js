const data =  require('../data.js');

const logger = require('../logger.js');
const app = require('../app').main;

module.exports = function() {
    app.get('/api/notifications/', function (req, res) {
        const news = data().news
            .map(newsItem => {
                newsItem.date = new Date(newsItem.date);

                return newsItem;
            })
            .sort((newsItemA, newsItemB) => newsItemB.date - newsItemA.date);

        res.json(news);
    });
};
