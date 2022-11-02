import db from "@/lib/api/database";
import { auths } from "@/lib/auth";
import { checkAuthenticated, checkNotAuthenticated } from "@/lib/auth/middleware";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";
import nextConnect from "next-connect";

import type { Request } from "express";
import type { NextApiResponse } from "next";

const handler = nextConnect<Request, NextApiResponse>();

handler.use(...auths);

// POST /api/auth/users (Signup Endpoint)
handler.post(checkNotAuthenticated, async (req, res) => {
  const { username, password1, password2 } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }
  if (!password1) {
    return res.status(400).json({ error: "Password is required." });
  }
  if (password1 !== password2) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  let user = await db.getUserFromUsername(username);

  if (user) {
    return res.status(400).json({ error: "Username is already taken." });
  }
  if (username.length < 2) {
    return res.status(400).json({ error: "Username must be at least 2 characters long." });
  }
  if (password1 !== password2) {
    return res.status(400).json({ error: "Passwords do not match." });
  }
  if (password1.length < 7) {
    return res.status(400).json({ error: "Password must be at least 7 characters long." });
  }

  const hashedPassword = await bcrypt.hash(password1, 10);

  try {
    const { insertedId } = await db.insertUser(username, hashedPassword);

    if (!insertedId) {
      throw new Error();
    }

    user = {
      _id: insertedId,
      username,
      password: hashedPassword,
    };

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(201).json({ user: { ...user, password: undefined } });
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/auth/users (Deactivate Account Endpoint)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
handler.delete(checkAuthenticated, async (req: any, res) => {
  try {
    logger.debug("Deleting user", req.user.id);

    await req.session.destroy();

    const { deletedCount } = await db.deleteUser(req.user.id);
    deletedCount === 1 ? res.status(204).end() : res.status(500).json({ error: "Internal Server Error" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default handler;
