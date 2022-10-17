/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import db from "@/lib/api/database";
import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";

const authenticateUser: VerifyFunction = async (
  username: string,
  password: string,
  done: (err: any, user?: any, info?: any) => void
) => {
  try {
    const user = await db.getUserFromUsername(username);

    if (!user) {
      return done(null, false, {
        message: "There is no user with that username.",
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: "Incorrect Password." });
    }

    return done(null, user);
  } catch (error: any) {
    return done(error);
  }
};

passport.use(new LocalStrategy(authenticateUser));

passport.serializeUser((user: any, done) => {
  done(null, { id: user._id });
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
