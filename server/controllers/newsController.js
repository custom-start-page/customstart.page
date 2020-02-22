const logger = require('../logger.js');
const track =  require('../track.js');
const app =  require('../app.js').main;
const data =  require('../data.js');

module.exports = function(page) {
    app.get(page.path, function(req, res) {
        track.pageView(req);

        const news = data().news
            .sort(newsItem => new Date(newsItem.date));

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
