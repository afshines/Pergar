
const Parser = require('rss-parser');

const parser = new Parser();


var Rss = require("./models/rss").Rss;



function fetchAndStoreRSS() {


    Rss.find({}).then(rsses => {

        rsses.forEach(rss => {
            if (rss.status)
                try {
                    parser.parseURL(rss.url).then(function (feed) {
                        //read   save to feed by  limit 
                        rss.feeds = [];
                      
                        feed.items.slice(0, rss.max_new_feeds).forEach(item => {  
                            rss.feeds.push({
                                title: item.title,
                                link: item.link,
                                description: (item.description) ? item.description:'',
                                category: '',
                                pubDate: item.pubDate,
                                enclosure: (item.enclosure && item.enclosure.url) ? item.enclosure.url:'',
                            });
                        })

                        var currentDate = new Date();
                        var timestamp = currentDate.getTime();
                        rss.last_seen = Math.floor(timestamp / 1000);

                        rss.save();

                    });


                } catch (err) {
                    console.error(err);
                    //continue
                }
        })

    })

    //get rss 
    //loop on them



}

module.exports = { fetchAndStoreRSS };