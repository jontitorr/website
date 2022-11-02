import { apiLimiter } from "@/lib/api";
import db, { Waifu } from "@/lib/api/database";
import { auths, checkAuthenticated } from "@/lib/auth";
import nextConnect from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import type { WaifuSearchResult } from "@/types/waifu";

const handler = nextConnect<NextApiRequest, NextApiResponse>({ attachParams: true });

handler.use(...auths, apiLimiter);

export type BrowseSearchResult = WaifuSearchResult & { image: string };

handler.get(checkAuthenticated, async (req, res) => {
  const { page, waifu } = req.query;

  if (!page && !waifu) {
    return res.status(400).json({ message: "Missing page or waifu" });
  }

  let waifus: Waifu[] = [];

  if (page) {
    let num: number;

    try {
      num = parseInt(page as string);
    } catch (error) {
      return res.status(400).json({ message: "Page must be a number" });
    }

    waifus = await db.getPageNOfWaifus(num);
  } else {
    waifus = await db.getWaifusLikeName(waifu as string);
  }

  const ret: BrowseSearchResult[] = [];

  for (const waifu of waifus) {
    ret.push({
      name: waifu.name,
      image: waifu.display_picture,
      series: {
        name: waifu.appearances.length ? waifu.appearances[0].name : "",
        endpoint: waifu.appearances.length ? `/series/${waifu.appearances[0].slug}` : "",
      },
      endpoint: `/waifus/${waifu.slug}`,
    });
  }

  return res.json(ret);
});

export default handler;
