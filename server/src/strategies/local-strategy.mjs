import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose-models/user.mjs";
import { comparePassword } from "../utils/hashPassword.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      throw new Error("User not found");
    }

    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    { usernameField: "identifier", passwordField: "password" },
    async (identifier, password, done) => {
      try {
        // Find user by email or phone

        const searchCriteria = isNaN(identifier)
        ? { email: identifier } 
        : {phone: identifier}
        const findUser = await User.findOne(searchCriteria);

        if (!findUser) {
          throw new Error("User not found");
        }

        const isMatch = await comparePassword(password, findUser.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);