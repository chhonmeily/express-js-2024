import passport from "passport";
import { Strategy } from "passport-facebook";
import { User } from "../mongoose/schema/user.mjs";
import { FacebookUser } from "../mongoose/schema/facebook-user.mjs";

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside Desirializer`);
  console.log(`Deserializing User ID: ${id}`);
  try {
    const findUser = await FacebookUser.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.REDIRECT_URL,
      scope: ["public_profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // not recommended for production case
      if (profile.username === undefined) {
        profile.username = profile.displayName
          .split(" ")
          .join("")
          .toLowerCase();
      }
      // not recommended for production case
      let findUser;
      try {
        findUser = await FacebookUser.findOne({
          facebookId: profile.id,
        });
      } catch (error) {
        return done(error, null);
      }
      try {
        if (!findUser) {
          const newUser = new FacebookUser({
            username: profile.username,
            facebookId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
