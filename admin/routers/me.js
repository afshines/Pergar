var express = require("express");
var router = express.Router();



router.get("/", async (req, res, next) => {
    return res.json(req.user );
});


module.exports = router;