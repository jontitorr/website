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

  const waifu = await db.getWaifu(slug);

  if (!waifu) {
    return res.status(400).json({ error: "No waifu found" });
  }

  const series: { name: string; endpoint: string }[] = [];

  if (waifu.appearances.length) {
    for (const appearance of waifu.appearances) {
      series.push({ name: appearance.name, endpoint: appearance.slug });
    }

    return res.json({ waifu, series });
  }

  res.json({ waifu, series });
});

export default handler;
