import React from "react";

import { SimpleGrid } from "@chakra-ui/react";
import MainLayout from "../layouts";
import { getAll, getParty } from "../logic/db";
import Parties from "../widgets/Parties";

export default function AdminDashboard({ parties }) {
  return (
    <MainLayout>
      <SimpleGrid columns={{ base: 1 }} gap={4}>
        <Parties parties={parties} />
      </SimpleGrid>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const env = process.env.NODE_ENV;
  if (env !== "development") {
    return {
      notFound: true,
    };
  }

  const partiesIds = await getAll("party");
  const parties = (
    await Promise.all(partiesIds.map((p) => p.split(":")[1]).map(getParty))
  ).sort((a, b) => a.name?.localeCompare(b.name));
  // TODO: sort by creation property

  return {
    props: {
      parties,
    },
  };
}