var express = require("express");
var router = express.Router();

var Media = require("../models/media").Media;

const { check, validationResult } = require("express-validator");

// router.get("/", async (req, res, next) => {
//     Media.find({})
//         .then(function (media) {
//             res.send({ media: media });
//         })
//         .catch(next);
// });


router.get("/searchAll", async (req, res, next) => {
    let list = [];
    let total = 0;
    const regex = new RegExp(req.query.name, "i");

    if (req.query.perPage != "-1") {
        list = await Media.find({ name: { $regex: regex } })
            .limit(parseInt(req.query.perPage))
            .skip(parseInt(req.query.perPage) * (parseInt(req.query.page) - 1))
            .select("_id name domain icon  status")
            .lean()
            .exec();
    } else {
        list = await Media.find({ name: { $regex: regex } })
            .select("_id name domain icon  status")
            .lean()
            .exec();
    }
    total = await Media.countDocuments({ name: { $regex: regex } })
        .select("_id")
        .exec();

    return res.json({ items: list, total: total });
});

router.get("/:id", async (req, res, next) => {
    Media.findById(req.params.id, async (er, media) => {
        return res.json(media);
    });
});

router.post("/", async (req, res, next) => {
    await check("name")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);

    await check("domain")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);

    await check("locations")
        .isArray()
        .withMessage("must be a array")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const media = new Media({
        name: req.body.name,
        domain: req.body.domain,
        icon: req.body.icon,
        locations:req.body.locations
    });


    await media.save();


    return res.json(media);
});

router.put("/:id", async (req, res, next) => {
    await check("name")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);

    await check("domain")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 chars long")
        .run(req);

    await check("locations")
        .isArray()
        .withMessage("must be a array")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    Media.findById(req.params.id, async (er, media) => {
        if (media !== null) {


            media.name = req.body.name;
            media.domain = req.body.domain;
            media.icon = req.body.icon;

            media.locations= req.body.locations;

            media.status = req.body.status;

            await media.save();
            return res.json(media);

        } else {
            return res.status(400).json({});
        }
    });
});

router.delete("/:id", async (req, res, next) => {
    Media.findById(req.params.id, async (er, media) => {
        await media.remove();
        return res.json({ deleted: true });
    });
});


module.exports = router;