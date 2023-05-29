var express = require("express");
var router = express.Router();

var Rss = require("../models/rss").Rss;

var Media = require("../models/media").Media;

const { check, validationResult } = require("express-validator");


const RemoveFromLocationByIdAndMedia = async (id, media_id, location_id) => {

  
    return await Rss.findById(id).then(async function (rss) {

        return await Media.update(
            { "_id": media_id },
            {
                "$pull":
                {
                    "locations.$[i].rss":
                    {
                        "_id": rss._id
                    }
                }
            },
            {
                arrayFilters: [
                    { "i._id": location_id, }
                ]
            }
        )
    });
};

const AddIntoLocationByIdAndMedia = async (id, media_id, location_id, limit) => {

    console.log({ "_id": media_id, "locations/_id": location_id, "locations": { $elemMatch: { "rss._id": id } } });    ////test


    return await Media.find({ "_id": media_id, "locations/_id": location_id, "locations": { $elemMatch: { "rss._id": id } } })
        .exec()
        .then(async (media) => {
            console.log(media);    ////test
          //  if (media.length == 0) {
                return await Rss.findById(id).then(async function (rss) {

                    console.log(rss);      ////test
                    return await Media.update(
                        { "_id": media_id },
                        {
                            "$push":
                            {
                                "locations.$[i].rss":

                                    { _id: rss._id, title: rss.title, limit: limit }

                            }
                        },
                        {
                            arrayFilters: [
                                { "i._id": location_id, }
                            ]
                        }
                    );
                });
        //    }

        });



};

router.post("/addToLocation", async (req, res, next) => {

    await AddIntoLocationByIdAndMedia(req.body.selectedRssItem, req.body.media_id, req.body.location_selected, req.body.limit)
    return res.json({ status: true });
});

router.post("/removeToLocation", async (req, res, next) => {

    await RemoveFromLocationByIdAndMedia(req.body.selectedRssItem, req.body.media_id, req.body.location_selected)

    return res.json({ status: true });
});

router.get("/", async (req, res, next) => {
    Rss.find({})
        .then(function (rss) {
            res.send({ rss: rss });
        })
        .catch(next);
});





module.exports = router;