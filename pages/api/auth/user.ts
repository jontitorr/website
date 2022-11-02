import { auths } from "@/lib/auth";
import nextConnect from "next-connect";

import type { Request, Response } from "express";

const handler = nextConnect<Request, Response>();

handler.use(...auths);

handler.get((req, res) => {
  return res.json({ user: req.user ?? null });
});

export default handler;
