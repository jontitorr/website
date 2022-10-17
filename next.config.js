/* eslint-disable @typescript-eslint/no-var-requires */
const withWorkbox = require("next-with-workbox");

/**
 * @type {import('next').NextConfig}
 */
module.exports = withWorkbox({
  // Workbox config
  workbox: {
    dest: "public",
    swDest: "sw.js",
    swSrc: "service-worker.js",
    force: true,
  },

  // Next.js config
  images: {
    domains: ["res.cloudinary.com", "abs.twimg.com", "pbs.twimg.com", "avatars.githubusercontent.com"],
  },
  reactStrictMode: true,
  swcMinify: false, // Required to fix: https://nextjs.org/docs/messages/failed-loading-swc
});
