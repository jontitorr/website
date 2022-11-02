import { apiLimiter } from "@/lib/api";
import db from "@/lib/api/database";
import { auths, checkAuthenticated } from "@/lib/auth";
import nextConnect from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = nextConnect<NextApiRequest, NextApiResponse>({ attachParams: true });

handler.use(...auths, apiLimiter);

handler.get(checkAuthenticated, async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: "Missing slug" });
  }
  if (Array.isArray(slug)) {
    return res.status(400).json({ message: "Slug must be a string" });
  }

  const series = await db.getSeries(slug);

  if (!series) {
    return res.status(400).json({ error: "No series found" });
  }

  return res.json(series);
});

export default handler;
