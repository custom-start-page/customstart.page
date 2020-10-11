const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const markdownRenderer = require('../markdownRenderer.js');

const helpers = require('../helpers.js');

module.exports = class Theme {
    constructor(themeFolderName) {
        this.themeFolderName = themeFolderName;

        if (this.themeExists() === false) {
            throw "Theme does not exist.";
        }
    }
    themeExists() {
        return fs.existsSync('./pages/' + this.themeFolderName);
    }
    getSlug() {
        return helpers.slugify(this.themeFolderName)
    }
    getPreview() {
        if (fs.existsSync('./pages/' + this.themeFolderName + '/manifest/preview.png'))
            return "/manifest/preview.png"

        if (fs.existsSync('./pages/' + this.themeFolderName + '/manifest/preview.jpg'))
            return "/manifest/preview.jpg"

        return '';
    }
    getAbout() {
        let readmeFilePath = './pages/' + this.themeFolderName + '/readme.md';

        if (fs.existsSync(readmeFilePath)) {
            const readmeMd = fs.readFileSync(readmeFilePath, 'utf8');

            return markdownRenderer(readmeMd);
        }

        readmeFilePath = './pages/' + this.themeFolderName + '/manifest/about.md';

        if (fs.existsSync(readmeFilePath)) {
            const readmeMd = fs.readFileSync(readmeFilePath, 'utf8');

            return markdownRenderer(readmeMd);
        }

        return 'No about. 😢';
    }
    getMeta() {
        const meta = JSON.parse(fs.readFileSync('./pages/' + this.themeFolderName + '/manifest/meta.json', 'utf8'));

        return meta;
    }
    getSchema() {
        const schema = JSON.parse(fs.readFileSync('./pages/' + this.themeFolderName + '/manifest/schema.json', 'utf8'));

        return schema;
    }
    getDefaultdata() {
        const data = JSON.parse(fs.readFileSync('./pages/' + this.themeFolderName + '/manifest/defaultData.json', 'utf8'));

        return data;
    }
    /**
     * Get the HTML for the start page.
     * @param {boolean} withAnalytics If the HTML should include analytics.
     * @returns {string}
     */
    getIndexHtml(withAnalytics) {
        const meta = this.getMeta();
        const root = this.getPath();
        const html = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');

        const $ = cheerio.load(html);

        // Change meta for SEO.
        {
            // Remove existing meta.
            $('head title').replaceWith('<!-- Removed custom title -->');
            $('head meta[name="description"]').replaceWith('<!-- Removed custom meta description. -->');

            // Ensure the page always targets the top (if loaded in an iframe).
            $('head').append('<base target="_top">\r\n');

            // Add my meta.
            $('head').append('<!-- Meta injected by Custom Start Page for SEO purposes -->\r\n');
            $('head').append(`<title>${meta.name} | Custom Start Page</title>\r\n`);
            $('head').append(`<meta name="description" content="${meta.name} is a free, open source and customisable start page for your browser, hosted by Custom Start Page.">\r\n`);
        }

        // Dirty inject.
        if (config.dev) {
            $('body').append(`<script src="//localhost/js/shared/inject.js"></script>`);
        } else {
            $('body').append(`<script src="/js/shared/inject.min.js"></script>`);
        }

        if (withAnalytics) {
            const analyticsInject = fs.readFileSync(global.config.basedir + '/views/partials/analytics.ejs', 'utf-8');

            $('body').append(analyticsInject);
        }

        return $.html();
    }
    getPath() {
        return path.join(
            global.config.basedir,
            'pages',
            this.themeFolderName,
            this.getMeta().outputDir || ''
        );
    }
}
