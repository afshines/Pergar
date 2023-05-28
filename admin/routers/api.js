var express = require("express");
var router = express.Router();

var News = require("../models/news").News;

var Media = require("../models/media").Media;


router.get("/", async (req, res, next) => {
 
   var media = await Media.findById(req.query.id).exec();

   if(media.status !=true)
   {  
        return res.status(200).json([]);
   }else
   {
       var sortParams = {'location.location' : 'desc'};
      News.find({media_id:req.query.id,status:true}).sort(sortParams)  
         .then(function (news) {
           
             return res.status(200).json(news);
         });
   }

});

module.exports = router;

