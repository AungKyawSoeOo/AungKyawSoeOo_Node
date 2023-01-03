import passport from "passport";
import passportJWT from "passport-jwt"
import dotenv from "dotenv"
import User from "../models/User.js"

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
dotenv.config();

export default passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey:process.env.jwtSecretOrKey
},
  function (jwtPayload: any, cb: any) {
    return User.findOne({ id: jwtPayload.id }, function (err: any, user: any) {
      if (err) {
        return cb(err, false);
      }
      if (user) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    })
  }
))