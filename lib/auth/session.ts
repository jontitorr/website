import db from "@/lib/api/database";
import { dev } from "@/lib/config";
import MongoStore from "connect-mongo";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";

if (!process.env.DB_NAME) {
  throw new Error("Please add your database name to .env");
}
if (!process.env.NEXT_PUBLIC_DOMAIN_NAME) {
  throw new Error("Please add your domain name to .env");
}

const mongoStore = MongoStore.create({
  clientPromise: db.getClient(),
  dbName: process.env.DB_NAME,
  stringify: false,
});

const getSession = nextSession({
  store: promisifyStore(mongoStore),
  cookie: {
    httpOnly: true,
    secure: !dev,
    maxAge: 60 * 60 * 24 * 30 * 2, // 2 months
    path: "/",
    sameSite: "strict",
    domain: dev ? undefined : `.${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
  },
  touchAfter: 60 * 60 * 24 * 30 * 1, // 1 month
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const session = async (req: any, res: any, next: any) => {
  await getSession(req, res);
  next();
};

export default session;
