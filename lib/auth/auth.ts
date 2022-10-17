import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import passport from "./passport";
import session from "./session";
import { authLimiter } from "../api";

const auths = [authLimiter, mongoSanitize(), compression(), session, passport.initialize(), passport.session()];

export default auths;
