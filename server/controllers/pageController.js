const logger = require('../logger.js');
const track =  require('../track.js');
const app =  require('../app.js').main;

module.exports = function(page) {
    app.get(page.path, function(req, res) {
        track.pageView(req);

        res.render('page', {
            layout: 'common',
            relativeUrl: '',
            metaDescription: page.metaDescription,
            pageGroup: page.pageGroup,
            pageTitle: page.pageTitle,
            bodyText: page.bodyText,
            page: page
        });
    });
};
