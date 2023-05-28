var express = require("express");
var router = express.Router();

var News = require("../models/news").News;

var Media = require("../models/media").Media;

const { check, validationResult } = require("express-validator");

const getMedia = async (news) => {
    return await Media.find({ "locations": { $elemMatch: { "news._id": news._id } } })
        .exec()
        .then(async (media) => {
            return await media.map(i => i.name);
        });
};

const RemoveFromLocationByIdAndMedia = async (id, media_id, location_id) => {

    return await News.findById(id).then(async function (news) {

        return await Media.update(
            { "_id": media_id },
            {
                "$pull":
                {
                    "locations.$[i].news":
                    {
                        "_id": news._id
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

const AddIntoLocationByIdAndMedia = async (id, media_id, location_id) => {


    return await Media.find({ "_id": media_id, "locations/_id": location_id, "locations": { $elemMatch: { "news._id": id } } })
        .exec()
        .then(async (media) => {

            if (media.length == 0) {
                return await News.findById(id).then(async function (news) {

                    return await Media.update(
                        { "_id": media_id },
                        {
                            "$push":
                            {
                                "locations.$[i].news":

                                    news

                            }
                        },
                        {
                            arrayFilters: [
                                { "i._id": location_id, }
                            ]
                        }
                    );
                });
            }

        });



};

const getLocationByIdAndMedia = async (id, media_id) => {
    return await Media.find({ "_id": media_id, "locations": { $elemMatch: { "news._id": id } } })
        .exec()
        .then(async (media) => {
            return media;
        });
};


router.get("/", async (req, res, next) => {
    News.find({})
        .then(function (news) {
            res.send({ news: news });
        })
        .catch(next);
});


router.get("/searchAll", async (req, res, next) => {
    let list = [];
    let total = 0;
    const regex = new RegExp(req.query.title, "i");


    let s_o = { title: { $regex: regex } };

    if (req.query.media_id != null && req.query.media_id != "null") {
        let ids = [];
        await Media.findById(req.query.media_id)
            .exec()
            .then(async (media) => {
                await media.locations.map(async (loc) => {
                    await loc.news.map(async (news) => {
                        if (!ids.includes(news._id))
                            ids.push(news._id)
                    })
                })
                s_o._id = { $in: ids };
            });

    }



    if (req.query.perPage != "-1") {
        list = await News.find(s_o)
            .limit(parseInt(req.query.perPage))
            .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
            .select("_id title url  status ")
            .lean()
            .sort({ createdAt: -1 })
            .exec();
    } else {
        list = await News.find(s_o)
            .select("_id title url  status ")
            .lean()
            .sort({ createdAt: -1 })
            .exec();
    }
    total = await News.countDocuments(s_o)
        .select("_id")
        .exec();


    let array = [];

    for await (let item of list) {
        array.push({ ...item, media: await getMedia(item) });
    }


    return res.json({ items: array, total: total });


});


router.get("/:id", async (req, res, next) => {
    News.findById(req.params.id, async (er, news) => {
        return res.json(news);
    });
});
router.get("/getLocationsByNews/:id/:media_id", async (req, res, next) => {
    let response = await getLocationByIdAndMedia(req.params.id, req.params.media_id);
    return res.json(response);
});
router.post("/addToLocation/:id/:media_id/:location_id", async (req, res, next) => {

    await AddIntoLocationByIdAndMedia(req.params.id, req.params.media_id, req.params.location_id)

    return res.json({ status: true });
});
router.post("/removeToLocation", async (req, res, next) => {

    await RemoveFromLocationByIdAndMedia(req.query.id, req.query.media_id, req.query.location_id)

    return res.json({ status: true });
});
router.post("/", async (req, res, next) => {
    await check("title")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);

    await check("url")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);


    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const news = new News({
        title: req.body.title,
        // media_id: req.body.media_id,
        url: req.body.url,
        status: req.body.status,
        // location: req.body.location,
    });


    await news.save();


    return res.json(news);
});

router.put("/:id", async (req, res, next) => {
    await check("title")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);

    await check("url")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);


    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    News.findById(req.params.id, async (er, news) => {
        if (news !== null) {




            const prv_news = { title: news.title, url: news.url, status: news.status };
            console.log(prv_news.status);

            news.title = req.body.title;
            news.url = req.body.url;
            news.status = req.body.status;

            await news.save();


            if (prv_news.title != news.title || prv_news.url != news.url || prv_news.status != news.status) {

                await Media.update(
                    {},
                    {
                        "$set":
                        {
                            "locations.$[].news.$[i]":

                                news

                        }
                    },
                    {
                        arrayFilters: [
                            { "i._id": news._id, }
                        ]
                    }
                )



            }



            return res.json(news);

        } else {
            return res.status(400).json({});
        }
    });
});
router.delete("/media/:id/:media_id", async (req, res, next) => {
    News.findById(req.params.id, async (er, news) => {
        if (news != null) {

            await Media.update(
                { "_id": req.params.media_id },
                {
                    "$pull":
                    {
                        "locations.$[].news":
                        {
                            "_id": news._id
                        }
                    }
                }
            );


        }

        return res.json({ deleted: true });
    });
});
router.delete("/:id", async (req, res, next) => {
    News.findById(req.params.id, async (er, news) => {
        if (news != null) {

            await Media.update(
                {},
                {
                    "$pull":
                    {
                        "locations.$[].news":
                        {
                            "_id": news._id
                        }
                    }
                }
            );


            await news.remove();
        }

        return res.json({ deleted: true });
    });
});
module.exports = router;