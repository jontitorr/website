import Layout from "@/components/Layout";
import { Button, Card, Col, Grid, Row, Text, useTheme } from "@nextui-org/react";
import fs from "fs";
import matter from "gray-matter";
import NextLink from "next/link";

export async function getStaticProps() {
  const files = fs.readdirSync("posts/blog");

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/blog/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

interface BlogProps {
  posts: {
    slug: string;
    frontmatter: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  }[];
}

export default function Blog({ posts }: BlogProps) {
  const { isDark } = useTheme();

  return (
    <Layout>
      <Grid.Container gap={2} justify="center">
        {posts.map(({ slug, frontmatter }) => (
          <Grid xs={12} sm={4} key={slug}>
            <Card>
              <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                <Col>
                  <Text h4>{frontmatter.title}</Text>
                </Col>
              </Card.Header>
              <Card.Image src={`/${frontmatter.socialImage}`} width={650} height={340} alt={frontmatter.title} />
              <Card.Footer
                isBlurred
                css={{
                  position: "absolute",
                  bgBlur: isDark ? "#0f111466" : "#f0f2f566",
                  borderTop: isDark ? "$borderWeights$light solid $gray800" : "$borderWeights$light solid $gray200",
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <Col>
                  <Row justify="flex-end">
                    <Button
                      flat
                      auto
                      rounded
                      css={{ color: isDark ? "$gray800" : "$gray100", bg: isDark ? "$gray100" : "$gray800" }}
                    >
                      <NextLink href={`/post/${slug}`}>
                        <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                          Read More
                        </Text>
                      </NextLink>
                    </Button>
                  </Row>
                </Col>
              </Card.Footer>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </Layout>
  );
}
