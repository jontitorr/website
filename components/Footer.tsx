import NextLink from "next/link";
import Layout from "./Layout";

export default function Footer() {
  return (
    <Layout className="pt-2 pb-4">
      <p className="flex justify-center md:justify-end gap-1">
        Made with
        <span role="img" aria-label="love">
          💖
        </span>
        by
        <NextLink href="https://github.com/xminent" target="_blank" rel="noopener noreferrer">
          Xminent
        </NextLink>
      </p>
    </Layout>
  );
}
