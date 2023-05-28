var express = require('express');
var router = express.Router();

var News = require("../models/news").News;

var Media = require("../models/media").Media;


router.get(
  '/',
  (req, res, next) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

// router.get(
//   '/test',
//   async (req, res, next) => {

//     News.find({})
//       .then(function (news) {


//         news.map(async (article) => {

//           article.locations.map(async (loc) => {
//             await Media.update(
//               { "_id": loc.media_id },
//               {
//                 "$push":
//                 {
//                   "locations.$[i].news":

//                   article

//                 }
//               },
//               {
//                 arrayFilters: [
//                   { "i.location": loc.location, }
//                 ]
//               }


//             );


//           })



//         })


//       })
//     res.json({
//       message: 'Succeed',

//     })
//   }
// );



module.exports = router;

