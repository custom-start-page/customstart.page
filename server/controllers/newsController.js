const logger = require('../logger.js');
const app =  require('../app.js').main;
const data =  require('../data.js');

module.exports = function(page) {
    app.get(page.path, function(req, res) {
        const news = data().news
            .map(newsItem => {
                newsItem.date = new Date(newsItem.date);

                return newsItem;
            })
            .sort((newsItemA, newsItemB) => newsItemB.date - newsItemA.date);

        res.render('news', {
            layout: 'common',
            relativeUrl: '',
            metaDescription: page.metaDescription,
            pageGroup: page.pageGroup,
            pageTitle: page.pageTitle,
            news: news,
            page: page,
        });
    });
};
