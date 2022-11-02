import { apiLimiter } from "@/lib/api";
import db from "@/lib/api/database";
import { auths, checkAuthenticated } from "@/lib/auth";
import nextConnect from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import type { WaifuSearchResult } from "@/types/waifu";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(...auths, apiLimiter);

handler.post(checkAuthenticated, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const results = await db.getWaifusLikeName(text);

  if (!results) {
    return res.status(400).json({ error: "No results found" });
  }

  const ret: WaifuSearchResult[] = results.map((result) => {
    return {
      name: result.name,
      series: {
        name: result.appearances.length ? result.appearances[0].name : "",
        endpoint: result.appearances.length ? result.appearances[0].slug : "",
      },
      endpoint: `/waifus/${result.slug}`,
    };
  });

  return res.json(ret);
});

export default handler;
