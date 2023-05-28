var key = undefined;


function init_box(_key) {
    key = _key;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.pooye-ads.com/api?id=" + key, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Response

            //foreach location automtic creation  with  id  and title

            var response = this.responseText;

            var news = JSON.parse(response);
            var elem;
            var prv_article = null;
            news.forEach(article => {

                if (prv_article == null || prv_article.location._id != article.location._id) {
                    elem = document.getElementById(article.location.location);
                  //  elem.innerHTML += "<h2>" + article.location.title + "</h2>";
                    // elem.innerHTML += "<ul>";
                }

                elem.innerHTML += "<li><a target='_blank' href='" + article.url + "'>" + article.title + "</a></li>";

                //if(prv_article == null || prv_article.location._id != article.location._id )
                //  elem.innerHTML += "</ul>";

                prv_article = article;
            });

        }
    };
    var data = {};
    xhttp.send(JSON.stringify(data));

    load_css();
}

function load_css() {

    var css = '',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

}
