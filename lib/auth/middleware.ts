import { dev, subdomains } from "../config";

import type { Request, Response, NextFunction } from "express";

/**
 * Checks if the user is already logged in and continues along with the request if successful. This is useful to prevent non-logged in users from seeing endpoints that require a login.
 * @param req The request for the endpoint.
 * @param res The response for the endpoint.
 * @param next The function which continues along with the request if the check was successful.
 * @returns `void`
 */
export const checkAuthenticated = (
  req: Request & { isAuthenticated: () => boolean },
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }

  const redirect = (() => {
    if (dev) {
      return "http://localhost:3000/login";
    }

    const { host } = req.headers;
    const index = subdomains.findIndex((subdomain) => host?.startsWith(subdomain));

    if (index === -1) {
      return `https://${host}/login`;
    }

    const toRemove = `${subdomains[index]}.`;
    return `https://${host?.replace(toRemove, "")}/login`;
  })();

  res.status(401).json({ message: "Please login first.", redirect });
};

/**
 * Checks if the user is already logged in and prevents the logged in user from accessing the endpoint. This is useful to prevent logged in users from seeing the `login` endpoint again.
 * @param req The request for the endpoint.
 * @param res The response for the endpoint.
 * @param next The function which continues along with the request if the check was successful.
 * @returns `void`
 */
export const checkNotAuthenticated = (
  req: Request & { isUnauthenticated: () => boolean },
  res: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) {
    return next();
  }
  res.status(401).json({ redirect: "/" });
};
