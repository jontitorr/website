/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import rateLimit from "express-rate-limit";
import MongoStore from "rate-limit-mongo";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
}
if (!process.env.DB_NAME) {
  throw new Error("Please add your database name to .env");
}

const appendPathToUrl = (url: string, path: string) => {
  const uri = new URL(url);
  uri.pathname = path;
  return uri.toString();
};

const createStore = (expireTimeMs: number) =>
  new MongoStore({
    uri: appendPathToUrl(process.env.MONGODB_URI, process.env.DB_NAME),
    collectionName: "api-rate-limits",
    expireTimeMs,
    errorHandler: console.error.bind(null, "rate-limit-mongo"),
  });

export const apiLimiter = rateLimit({
  store: createStore(15 * 60 * 1000), // 15 minutes
  max: 100,
  windowMs: 15 * 60 * 1000,
});

export const authLimiter = rateLimit({
  store: createStore(1000), // 1 second
  max: 100, // 100 requests per second for any auth endpoint
  windowMs: 1000,
});
