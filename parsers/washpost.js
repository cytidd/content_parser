var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

const selectors = {
    URL_SITE: 'https://www.washingtonpost.com',
    HEADLINE_SELECTOR: 'a[data-pb-field=web_headline]',
    SOURCE: 'WASHPOST'
};

var exports = module.exports = {};

exports.parseWashingtonPost = function() {
    return new Promise(function(resolve, reject){

        nightmare
        .goto(selectors.URL_SITE)
        .evaluate(function (selectors) {

            // grab any <article> element and parse into categorized list of urls and titles
            var items = {};
            document.querySelectorAll(selectors.HEADLINE_SELECTOR).forEach(function(article){
                console.log(article);
                var headline = article.textContent ? article.textContent.trim() : "",
                    url = article.href || "",
                    section_name = url.slice(selectors.URL_SITE.length + 1).split('/')[0];

                if(section_name === 'null' || section_name.indexOf('-') >= 0) {
                    section_name = 'general';
                }

                if(items[section_name] === undefined) {
                    items[section_name] = [];
                }

                // skip items with no title or uri
                if(url.indexOf(selectors.URL_SITE) >= 0 &&
                   headline.length > 0 &&
                   url.length > 0) {

                    items[section_name].push({
                        source: selectors.SOURCE,
                        title: headline,
                        url: url
                    });
                }
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
