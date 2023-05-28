var express = require("express");
var router = express.Router();

var Media = require("../models/media").Media;

router.get("/", async (req, res, next) => {
    Media.find({})
        .then(function (media) {
            res.send({ media: media });
        })
        .catch(next);
});



module.exports = router;