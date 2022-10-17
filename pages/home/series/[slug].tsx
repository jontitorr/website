import Layout from "@/components/Layout";
import { logger } from "@/lib/logger";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, Grid, Text, Row, Badge } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

import type { Series as SeriesData, SeriesWaifu } from "@/lib/api";

interface WaifuItemProps {
  waifu: SeriesWaifu;
}

const SeriesAttribute = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
  customClass?: string;
}) => {
  if (!value) {
    return null;
  }

  return (
    <Row justify="space-between">
      <Text b>{label}</Text>
      <Text>{value}</Text>
    </Row>
  );
};

export default function Series() {
  const [seriesData, setSeriesData] = useState<SeriesData | null>(null);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) {
      return;
    }

    fetch(`/api/series/${slug}`).then(async (res) => {
      if (res.status === 200) {
        const data = await res.json();

        logger.debug(data);

        setSeriesData(data);
      }
    });
  }, [slug]);

  const WaifuItem = ({ waifu }: WaifuItemProps) => {
    return (
      <Card
        isHoverable
        isPressable
        onPress={() => {
          router.push(`/waifus/${waifu.slug}`);
        }}
      >
        <Card.Body css={{ p: 0 }}>
          <Card.Image src={waifu.display_picture} objectFit="cover" width="100%" height={140} alt={waifu.name} />
        </Card.Body>
        <Card.Footer css={{ justifyItems: "flex-start" }}>
          <Row wrap="wrap" justify="space-between" align="center">
            <Text b>{waifu.name}</Text>
            <Row justify="space-between">
              <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>{waifu.like_rank}</Text>
              <FontAwesomeIcon icon={faHeart} color="pink" />
            </Row>
            <Row justify="space-between">
              <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>{waifu.trash_rank}</Text>
              <FontAwesomeIcon icon={faTrash} color="grey" />
            </Row>
          </Row>
        </Card.Footer>
      </Card>
    );
  };

  const badgeColorPerType = {
    TV: "primary",
    Movie: "success",
    OVA: "warning",
    ONA: "error",
    Special: "default",
    Music: "secondary",
  };

  type BadgeColor = keyof typeof badgeColorPerType;

  return (
    <Layout>
      <Text h1 css={{ textAlign: "center" }}>
        {seriesData?.name}
      </Text>
      {seriesData?.original_name && (
        <Text
          css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm", textAlign: "center" }}
        >{`A.K.A. ${seriesData.original_name}`}</Text>
      )}
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-8 p-4">
        <Card css={{ maxWidth: "28rem", height: "100%" }}>
          <Card.Body css={{ p: 0 }}>
            <Card.Image src={seriesData?.image || "/images/no_img.png"} objectFit="cover" alt={seriesData?.name} />
          </Card.Body>

          <Card.Footer css={{ justifyItems: "flex-start", flexDirection: "column", justifyContent: "space-between" }}>
            <Row wrap="wrap" justify="space-between" align="center">
              <Text b>{seriesData?.name}</Text>
              <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                {seriesData?.description}
              </Text>
            </Row>

            {seriesData?.type && (
              <Row justify="space-between">
                <Text b>Type</Text>
                <Row justify="flex-end">
                  <Badge
                    color={
                      badgeColorPerType[seriesData.type as BadgeColor] as
                        | "primary"
                        | "success"
                        | "warning"
                        | "error"
                        | "secondary"
                        | "default"
                    }
                  >
                    {seriesData.type}
                  </Badge>

                  {seriesData?.nsfw && <Badge color="error">NSFW</Badge>}
                </Row>
              </Row>
            )}

            <SeriesAttribute label="Episodes" value={seriesData?.episode_count} />

            {seriesData?.release && (
              <Row justify="space-between">
                <Text b>Release Date</Text>
                <Text>{new Date(seriesData.release).toLocaleDateString()}</Text>
              </Row>
            )}

            <SeriesAttribute label="Studio" value={seriesData?.studio} />
          </Card.Footer>
        </Card>

        <Grid.Container gap={2} justify="center">
          {seriesData?.waifus.map((waifu) => (
            <Grid md={3} key={waifu.id}>
              <WaifuItem waifu={waifu} />
            </Grid>
          ))}
        </Grid.Container>
      </div>
    </Layout>
  );
}
