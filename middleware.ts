import { NextResponse } from "next/server";
import { dev, subdomains } from "./lib/config";

import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /images (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|images|[\\w-]+\\.\\w+).*)",
  ],
};

if (!process.env.VERCEL_PROJECT_NAME) {
  throw new Error("Please add your Vercel Project Name to .env");
}
if (!process.env.VERCEL_USERNAME) {
  throw new Error("Please add your Vercel Username to .env");
}
if (!process.env.NEXT_PUBLIC_DOMAIN_NAME) {
  throw new Error("Please add your domain name to .env");
}

const vercelHostname = `${process.env.VERCEL_PROJECT_NAME}-${process.env.VERCEL_USERNAME}.vercel.app`;
const vercelGitHostname = `${process.env.VERCEL_PROJECT_NAME}-git-master-${process.env.VERCEL_USERNAME}.vercel.app`;
const hostnames = [vercelHostname, vercelGitHostname, process.env.NEXT_PUBLIC_DOMAIN_NAME];

export default function middleware(req: NextRequest) {
  const { nextUrl: url } = req;
  const host = req.headers.get("host");

  if (!host) {
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  const subdomain = (() => {
    if (dev) {
      return host.replace(".localhost:3000", "");
    }

    let ret = "";

    hostnames.forEach((hostname) => {
      if (host.endsWith(hostname)) {
        ret = host.replace(`.${hostname}`, "");
      }
    });

    return ret;
  })();

  if (subdomains.includes(subdomain)) {
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  if (["/login", "/signup"].includes(url.pathname) && req.cookies.get("sid")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  url.pathname = `/home${url.pathname}`;
  return NextResponse.rewrite(url);
}
