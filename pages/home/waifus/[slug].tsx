import Layout from "@/components/Layout";
import { logger } from "@/lib/logger";
import { Image } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./waifu.module.css";

import type { Nullable, Waifu as WaifuData } from "@/lib/api/database";

const WaifuAttribute = ({
  label,
  value,
  customClass,
}: {
  label: string;
  value: string | number | undefined | null;
  customClass?: string;
}) => (
  <div className={customClass}>
    <h2 className={`${styles.smTitle} `}>{label}</h2>
    {value ? <p className={styles.description}>{value}</p> : <p className={styles.description}>N/A</p>}
  </div>
);

type SeriesData = { name: string; endpoint: string }[];

export default function Waifu() {
  const [seriesData, setSeriesData] = useState<SeriesData>([]);
  const [waifuData, setWaifuData] = useState<WaifuData | null>(null);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) {
      return;
    }

    fetch(`/api/waifus/${slug}`).then(async (res) => {
      if (res.status === 200) {
        const { series, waifu } = await res.json();

        logger.debug({ series, waifu });

        setSeriesData(series);
        setWaifuData(waifu);
      }
    });
  }, [slug]);

  const formatBirthday = (
    month: Nullable<number> | undefined,
    day: Nullable<number> | undefined,
    year: Nullable<number> | undefined
  ) => {
    if (!month && !day && !year) {
      return "N/A";
    }
    return `${month ? month : "???"} / ${day ? day : "???"} / ${year ? year : "???"}`;
  };

  return (
    <Layout>
      <div
        className={`${styles["banner-box"]} flex flex-col md:flex-row relative items-center md:items-start gap-4 md:gap-16`}
      >
        <div className={`${styles["waifu-avatar"]} md:ml-4`}>
          {waifuData?.display_picture ? (
            <Image src={waifuData.display_picture} alt={waifuData.name} width={300} height={300} />
          ) : (
            <Image src="/images/no_img.png" alt={waifuData?.name} width={300} height={300} />
          )}
        </div>
        <div className={`${styles.content} flex items-center md:items-stretch flex-col mx-auto  gap-5 md:gap-2`}>
          <div className={`${styles.box} text-center lg:text-left`}>
            <h1 className="title">{waifuData?.name}</h1>
            {waifuData?.alternative_name && <p>{waifuData.alternative_name}</p>}
          </div>

          {seriesData.length > 0 && (
            <div className={`${styles.box} text-center lg:text-left`}>
              <h2 className={`${styles.smTitle}`}>Appears In</h2>
              {seriesData.map((seriesData, i) => (
                <p className={styles.description} key={i}>
                  <NextLink href={`/series/${seriesData.endpoint}`}>{seriesData.name}</NextLink>
                </p>
              ))}
            </div>
          )}

          <div
            className={`${styles.box} flex flex-row justify-center lg:justify-start gap-12 text-center lg:text-left`}
          >
            <WaifuAttribute label="Origin" value={waifuData?.origin} />
            <WaifuAttribute label="Height" value={waifuData?.height} />
            <WaifuAttribute label="Bust" value={waifuData?.bust} />
            <WaifuAttribute label="Age" value={waifuData?.age} />
          </div>

          <div
            className={`${styles.box} flex flex-row justify-center lg:justify-start gap-12 text-center lg:text-left`}
          >
            <WaifuAttribute label="Weight" value={waifuData?.weight} />
            <WaifuAttribute label="Waist" value={waifuData?.waist} />
            <WaifuAttribute label="Hip" value={waifuData?.hip} />
          </div>

          <WaifuAttribute
            label="Date of Birth"
            value={formatBirthday(waifuData?.birthday_month, waifuData?.birthday_day, waifuData?.birthday_year)}
            customClass={`${styles.box} text-center lg:text-left`}
          />
          <WaifuAttribute
            label="Blood Type"
            value={waifuData?.blood_type}
            customClass={`${styles.box} text-center lg:text-left`}
          />
          <WaifuAttribute
            label="Description"
            value={waifuData?.description}
            customClass={`${styles.box} text-center lg:text-left`}
          />
        </div>
      </div>
    </Layout>
  );
}

Waifu.requiresAuth = true;
