import Input from "@/components/Input";
import Layout from "@/components/Layout";
import { logger } from "@/lib/logger";
import { Col, Link, Loading, Pagination, Row, Table, User } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import type { BrowseSearchResult } from "pages/api/waifus/browse";
import type { FormElement, NormalColors } from "@nextui-org/react";

export default function Browse() {
  const [browseResults, setBrowseResults] = useState<BrowseSearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalPage, setOriginalPage] = useState(1);
  const [total, setTotal] = useState(1824);
  const [waifuResults, setWaifuResults] = useState<BrowseSearchResult[]>([]);

  const router = useRouter();
  const { query } = router;

  const onWindowResize = () => {
    setIsSmallScreen(window.innerWidth < 640);
  };

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    const page = query.page ? parseInt(query.page as string) : 1;
    setCurrentPage(page);
    setOriginalPage(page);
  }, [query]);

  useEffect(() => {
    logger.debug("Browse page loaded.", { currentPage });

    setLoading(true);
    fetch(`/api/waifus/browse?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setBrowseResults(data);
        setWaifuResults([]);
        setLoading(false);
      });
  }, [currentPage]);

  const resetPage = () => {
    setTotal(1824);
    setWaifuResults([]);
    setCurrentPage(originalPage);
  };

  const handleWaifuSearch = (e: React.KeyboardEvent<FormElement>) => {
    const { value } = e.target as FormElement;
    logger.debug({ value });

    if (!value) {
      return resetPage();
    }

    logger.debug("Searching for waifu: ", value);

    setLoading(true);

    fetch(`/api/waifus/browse?waifu=${value}`)
      .then((res) => res.json())
      .then((data) => {
        setTotal(Math.ceil(data.length / 20));
        setWaifuResults(data);
        setCurrentPage(1);
        setLoading(false);
      });
  };

  type ColumnKey = "name" | "series";

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "SERIES", uid: "series" },
  ];

  const randomColor = () => {
    const colors = ["default", "primary", "secondary", "success", "warning", "error"];

    return colors[Math.floor(Math.random() * colors.length)] as NormalColors;
  };

  const renderCell = (waifu: BrowseSearchResult, columnKey: ColumnKey) => {
    const cellValue = waifu[columnKey];
    switch (columnKey) {
    case "name": {
      return (
        <User
          bordered
          src={waifu.image}
          name={cellValue}
          css={{ p: 0 }}
          size="xl"
          color={randomColor()}
          pointer
          onClick={() => {
            router.push(waifu.endpoint);
          }}
        />
      );
    }
    case "series": {
      return (
        <Col className="whitespace-normal break-normal" style={{ inlineSize: "fit-content" }}>
          <Row>
            <NextLink href={waifu.series.endpoint}>
              <Link isExternal>{(cellValue as { name: string; endpoint: string }).name}</Link>
            </NextLink>
          </Row>
        </Col>
      );
    }
    }
  };

  const renderTable = () => {
    const columnsToRender = isSmallScreen ? columns.slice(0, 1) : columns;

    return (
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl shadow-2xl shadow-red-600 rounded-3xl">
        <Table bordered aria-label="Waifu table" containerCss={{ p: 0, borderColor: "yellow" }}>
          <Table.Header columns={columnsToRender}>
            {(column) => (
              <Table.Column key={column.uid} align={"start"}>
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={waifuResults.length ? waifuResults.slice((currentPage - 1) * 20, currentPage * 20) : browseResults}
          >
            {(item) => (
              <Table.Row key={item.endpoint}>
                {(columnKey) => {
                  return <Table.Cell>{renderCell(item, columnKey as ColumnKey)}</Table.Cell>;
                }}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-8 p-4">
        <div className="flex flex-col items-center gap-8">
          <h1>Browse Waifus</h1>
          <p>Become cultured.</p>
          <Input
            clearable
            bordered
            color="primary"
            contentRight={loading ? <Loading size="xs" /> : null}
            placeholder="Rem, Zero Two, etc."
            stoppedTyping={handleWaifuSearch}
            label="Search for a waifu"
            onClearClick={resetPage}
          />

          <Pagination shadow total={total} initialPage={currentPage} page={currentPage} onChange={setCurrentPage} />
        </div>

        {browseResults.length || waifuResults.length ? (
          renderTable()
        ) : (
          <>
            <h3>No results found</h3>
          </>
        )}
      </div>
    </Layout>
  );
}

Browse.requiresAuth = true;
