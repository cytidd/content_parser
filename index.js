var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });

const selectors = {
    URL_CNN: 'http://www.cnn.com/',
    ARTICLE_SELECTOR: 'article',
    ARTICLE_TITLE: '.cd__headline-text',
    SECTION_NAME: 'data-section-name',
    ARTICLE_URI: 'data-vr-contentbox'
};

nightmare
  .goto(selectors.URL_CNN)
  .evaluate(function (selectors) {
    var items = {};
    document.querySelectorAll(ARTICLE_SELECTOR).forEach(function(article){
        var headline = article.querySelector(ARTICLE_TITLE),
            section_name = article.getAttribute(SECTION_NAME);

        if(items[section_name] === undefined) {
            items[section_name] = [];
        }

        items[section_name].push({
            title: headline ? headline.textContent.trim() : "",
            url: selectors.URL_CNN + '/' + article.getAttribute(ARTICLE_URI)
        });
    });

    return items;
  }, selectors)
  .end()
  .then(function (articles) {
    console.log(articles);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
