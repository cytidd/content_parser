var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

const selectors = {
    URL_CNN: 'http://www.cnn.com/',
    ARTICLE_SELECTOR: 'article',
    ARTICLE_TITLE: '.cd__headline-text',
    SECTION_NAME: 'data-section-name',
    ARTICLE_URI: 'data-vr-contentbox'
};

var exports = module.exports = {};

exports.parseCNN = function() {
    return new Promise(function(resolve, reject){

        nightmare
        .goto(selectors.URL_CNN)
        .evaluate(function (selectors) {

            // grab any <article> element and parse into categorized list of urls and titles
            var items = {};
            document.querySelectorAll(selectors.ARTICLE_SELECTOR).forEach(function(article){
                var headline = article.querySelector(selectors.ARTICLE_TITLE),
                    section_name = article.getAttribute(selectors.SECTION_NAME);

                if(items[section_name] === undefined) {
                    items[section_name] = [];
                }

                items[section_name].push({
                    title: headline ? headline.textContent.trim() : "",
                    url: selectors.URL_CNN + '/' + article.getAttribute(selectors.ARTICLE_URI)
                });
            });

            return items;
        }, selectors)
        .end()
        .then(function (articles) {
            resolve(articles);
        })
        .catch(function (error) {
            reject(error);
        });

    });
}

