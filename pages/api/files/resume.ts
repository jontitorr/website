import { apiLimiter } from "@/lib/api";
import fs from "fs";
import nextConnect from "next-connect";
import path from "path";

import type { Request, Response } from "express";

const handler = nextConnect<Request, Response>();

handler.use(apiLimiter);

handler.get(async (_req, res) => {
  try {
    const filePath = path.join(process.cwd(), "/public/resume.pdf");
    const buffer = fs.createReadStream(filePath);

    await new Promise(function (resolve) {
      res.setHeader("Content-Type", "application/pdf");
      buffer.pipe(res);
      buffer.on("end", resolve);
      buffer.on("error", function (err: NodeJS.ErrnoException) {
        if (err.code !== "ENOENT") {
          res.status(500).json({ error: true, message: "Sorry, something went wrong!" });
          return res.end();
        }

        res.status(400).json({
          error: true,
          message: "Sorry we could not find the file you requested!",
        });
        res.end();
      });
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err });
    res.end();
  }
});

export default handler;
