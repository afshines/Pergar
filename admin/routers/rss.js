var express = require("express");
var router = express.Router();

var Rss = require("../models/rss").Rss;
var Media = require("../models/media").Media;

const { check, validationResult } = require("express-validator");

router.get("/searchAll", async (req, res, next) => {
    let list = [];
    let total = 0;

    if (req.query.perPage != "-1") {
        list = await Rss.find({  })
            .limit(parseInt(req.query.perPage))
            .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
            .select("_id title url max_new_feeds  status")
            .lean()
            .exec();
    } else {
        list = await Rss.find({  })
            .select("_id title url max_new_feeds  status")
            .lean()
            .exec();
    }
    total = await Rss.countDocuments({ })
        .select("_id")
        .exec();

    return res.json({ items: list, total: total });
});


router.get("/:id", async (req, res, next) => {
    Rss.findById(req.params.id, async (er, rss) => {
        return res.json(rss);
    });
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

    const rss = new Rss({
        title: req.body.title,
        url: req.body.url,
        status: req.body.status,
        max_new_feeds: req.body.max_new_feeds,
    });


    await rss.save();


    return res.json(rss);
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

    Rss.findById(req.params.id, async (er, rss) => {
        if (rss !== null) {

            rss.title = req.body.title;
            rss.url = req.body.url;
            rss.status = req.body.status;
            rss.max_new_feeds = req.body.max_new_feeds;
    
            await rss.save();
            return res.json(rss);

        } else {
            return res.status(400).json({});
        }
    });
});


router.delete("/:id", async (req, res, next) => {
    Rss.findById(req.params.id, async (er, rss) => {
     
        if (rss != null) {

            await Media.update(
                {},
                {
                    "$pull":
                    {
                        "locations.$[].rss":
                        {
                            "_id": rss._id
                        }
                    }
                }
            );

           
            await rss.remove();
        }

        return res.json({ deleted: true });
    });
});


module.exports = router;