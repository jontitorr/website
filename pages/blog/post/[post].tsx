import Layout from "@/components/Layout";
import { Text } from "@nextui-org/react";
import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";

export async function getStaticPaths() {
  const files = fs.readdirSync("posts/blog");

  const paths = files.map((fileName) => ({
    params: {
      post: fileName.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

interface StaticPostParams {
  params: {
    post: string;
  };
}

export async function getStaticProps({ params: { post } }: StaticPostParams) {
  const fileName = fs.readFileSync(`posts/blog/${post}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}

interface PostProps {
  frontmatter: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  content: string;
}

export default function Post({ frontmatter, content }: PostProps) {
  return (
    <Layout>
      <Text h1>{frontmatter.title}</Text>
      <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
    </Layout>
  );
}
