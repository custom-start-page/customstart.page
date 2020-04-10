const marked = require('marked');
const helpers = require('./helpers');
const fs = require('fs');
const logger = require('./logger');

const renderer = function() {
    var renderer = new marked.Renderer();
    var ampRenderer = new marked.Renderer();

    var linkRender = function(href, title, text) {
        // If it is an external link...
        if (href.startsWith('http')) {
            return '<a target="_blank" href="'+ href +'">' + text + '</a>';
        }

        return '<a href="'+ href +'">' + text + '</a>';
    };

    renderer.link = linkRender;

    ampRenderer.link = linkRender;

    ampRenderer.image = function(href, title, text) {
        return '<amp-img src="' + href + '" alt="' + text + '" layout="responsive" height="400" width="800"></amp-img>';
    };

    return {
        normal: renderer,
        amp: ampRenderer
    };
}();

const data = function() {
    logger.info('data running');

    var actualData = null;

    var findData = (dir, currentData) => {
        currentData = currentData || {};
        let paths = fs.readdirSync(dir);

        // Foreach of the JSON files...
        paths
            .filter(path => path.includes('.json'))
            .forEach(path => {
                let fullPath = dir + '/' + path;

                try {
                    let contents = fs.readFileSync(fullPath, 'utf8');
                    let json = JSON.parse(contents);

                    // If it's in dev mode, then the unpublished blog posts should show.
                    if (typeof json.published !== 'undefined' && !json.published && !global.dev) {
                        return;
                    }

                    for (const key of Object.keys(json)) {
                        if (typeof json[key] === 'string' && json[key].endsWith('.md')) {
                            json[key] = data.getContent(json[key]);
                        }
                    }

                    // The lastmod tag is optional in sitemaps and in most of the cases it's ignored by search engines
                    // https://stackoverflow.com/a/31354426
                    //json.lastModified = fs.statSync(fullPath).mtime;

                    if (helpers.isObject(currentData)) {
                        currentData[json.name] = json;
                    } else {
                        currentData.push(json);
                    }
                } catch (e) {
                    logger.error(e);
                }
            });

        // Foreach of the folder...
        paths
            .filter(path => !path.includes('.'))
            .forEach(path => {
                if (typeof currentData[path] === 'undefined') {
                    currentData[path] = [];

                    findData(dir + '/' + path, currentData[path]);
                } else {
                    currentData[path].children = [];

                    findData(dir + '/' + path, currentData[path].children);
                }
            });

        return currentData;
    };

    // Reloads the data if in dev mode, better for writing new posts!
    return function() {
        if (actualData === null || global.dev) {
            actualData = findData(global.config.basedir + '/data');
        }

        return actualData;
    };
}();

/**
 * Reads a file.
 * Will return HTML, even if the original format is Markdown.
 * @param {string} path
 * @param {boolean} isAmp
 */
data.getContent = function(path) {
    let contents = fs.readFileSync('data/' + path, 'utf8');

    if (path.indexOf('.md') !== -1) {
        return marked(contents, { renderer: renderer.normal })
            // Replace YouTube links with an embedded YouTube video.
            .replace(
                /<p><a target="_blank" href=\"(?:https:\/\/www\.youtube\.com\/watch\?v=){1}(.*)\">([^<]*)<\/a><\/p>/gm,
                `<a class="youtube-video" href="https://www.youtube.com/embed/$1" target="_blank" style="background-image:url('https://img.youtube.com/vi/$1/maxresdefault.jpg')" data-id="$1"><div class="icon-play youtube-video-play"></div><div class="youtube-video-title">$2</div></a>`
            );
    }

    return contents;
};

data.forEachPage = function(callback, obj) {
    obj = obj || data();

    for (let key of Object.keys(obj)) {
        let page = obj[key];

        callback(page);

        if (typeof page.children !== 'undefined' && page.children.length > 0) {
            data.forEachPage(callback, page.children);
        }
    }
};

data.flatten = function() {
    let pages = [];

    data.forEachPage(page => {
        pages.push(page);
    });

    return pages;
};

data.getPage = function(url) {
    return data.flatten()
        .find(page => page.path === url);
};

module.exports = data;
