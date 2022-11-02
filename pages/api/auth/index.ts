import { auths } from "@/lib/auth";
import { checkAuthenticated, checkNotAuthenticated } from "@/lib/auth/middleware";
import passport from "@/lib/auth/passport";
import nextConnect from "next-connect";

import type { Request } from "express";
import type { NextApiResponse } from "next";

const handler = nextConnect<Request, NextApiResponse>();

handler.use(...auths);

// POST /api/auth/users (Login Endpoint)
handler.post(checkNotAuthenticated, async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ user: { ...user, password: undefined } });
    });
  })(req, res, next);
});

// DELETE /api/auth/users (Logout Endpoint)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
handler.delete(checkAuthenticated, async (req: any, res) => {
  await req.session.destroy();
  res.status(204).end();
});

export default handler;
