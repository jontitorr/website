import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";

import { authLimiter } from "../api";
import passport from "./passport";
import session from "./session";

const auths = [authLimiter, mongoSanitize(), compression(), session, passport.initialize(), passport.session()];

export default auths;
