var express = require("express");
var router = express.Router();

const JWT = require("jsonwebtoken");
const Users = require("../models/user").Users;

router.get("/me", async (req, res, next) => {

});
//router.get("/test", async (req, res, next) => {
  //   const user = new Users({
  //     name: "Operator",
  //     roles: ["operator"],
  //     mobile: "09158978364",
  //     code:20222023,

  // });


  //await user.save();

 // const News = require("../models/news").News;
 // await News.updateMany({}, { status: true });
  //return 900;


//});

router.post("/login", async (req, res, next) => {
  const user = await Users.findOne({
    mobile: req.body.mobile
  });

  if (!user) {
    return res.status(401).send({
      message: "User not found",
    });
  }

  const validate = user.code == req.body.code;

  if (!validate) {
    return res.status(401).send({
      message: "Wrong Code",
    });
  }

  const JWTTken = JWT.sign(
    { id: user._id, mobile: user.mobile },
    process.env.JWD_SECRET
  );
  return res.status(200).send({
    token: JWTTken,
    message: "wellcome",
  });
});


module.exports = router;
