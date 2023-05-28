const http = require('http');
const url = require('url');
const querystring = require('querystring');

require("dotenv").config();


const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const newsSchema = require("./models/news").newsSchema;
const mediaSchema = require("./models/media").mediaSchema;
const { rssSchema } = require('./models/rss');

News = mongoose.model('News', newsSchema);
Media = mongoose.model('Media', mediaSchema);
Rss = mongoose.model('Rss', rssSchema);

const hostname = '127.0.0.1';
const port = 8000;

async function _getRss(media) {
  ///load Rss //
  //loop for all locations
  console.log('before loop************************* ' + media.locations[0].news.length);



  await media.locations.forEach(async (loc) => {
    if (loc.rss.length > 0) { // has rss 
      // loop in rss  
      await loc.rss.forEach(async (_rss) => {


        console.log('findById*********************** ' + _rss._id);

        Rss.findById(_rss._id, async (er, rss) => {
          //get feeds    (title,link) 
          var index = 0;
          await rss.feeds.forEach(async (feed) => {
            index++;

            if (index <= _rss.limit) {


              await media.locations.filter(i => { return i._id == loc._id })[0].news.push({ url: feed.link, title: feed.title });


              console.log('in loop************************* ' + media.locations[0].news.length);

            } else {
              return;
            }

          });



          // load max limit and add  feeds to news list 

        });
      });

    }


  });
  console.log('after loop************************* ' + media.locations[0].news.length);
  ///

  return media;
}

const server = http.createServer(async (req, res) => {


  const parsed = url.parse(req.url);
  const query = querystring.parse(parsed.query);

  var media = await Media.findById(query.id).populate({
    path: "locations.rss",
    populate: {
      path: "feeds",
    },
  }).exec();

  if (media == null || media.status != true) {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end("[]");

  } else {




        await media.locations.forEach(async (loc) => {

          if (loc.rss.length > 0) { 

            await loc.rss.forEach(async (rss) => {


             var index = 0;

              await rss.feeds[0].feeds.forEach(async (feed) => {
                index++;
    
                if (index <= rss.limit) {
    
                  await media.locations.filter(i => { return i._id == loc._id })[0].news.push({ url: feed.link, title:  feed.title });
      
    
                } else {
                  return;
                }
    
              });

            
      
            });

          }
        });


        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(JSON.stringify(media.locations));





  }


});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});