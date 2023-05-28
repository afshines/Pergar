const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const StrategyJwt = passportJWT.Strategy;
const Users = require("../models/user").Users;

passport.use(
  "admin-rule",
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWD_SECRET,
    },
    function (jwtPayload, done) {
      return Users.findById(jwtPayload.id)
        .then((user) => {
          if (user.roles.includes("admin")) return done(null, user);
          else return done(null, false, { message: "Incorrect Admin." });
        })
        .catch((eer) => {
          return done(eer);
        });
    }
  )
);

passport.use(
  "operator-rule",
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWD_SECRET,
    },
    function (jwtPayload, done) {
      return Users.findById(jwtPayload.id)
        .then((user) => {
          if (user.roles.includes("operator") || user.roles.includes("admin")) return done(null, user);
          else return done(null, false, { message: "Incorrect user." });
        })
        .catch((eer) => {
          return done(eer);
        });
    }
  )
);