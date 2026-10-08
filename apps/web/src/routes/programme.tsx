import { createFileRoute } from "@tanstack/react-router";

import { Programme } from "@/components/programme/programme";
import { buildSeoMeta } from "@/utils/seo";

const ProgrammeRoute = () => <Programme />;

export const Route = createFileRoute("/programme")({
  head: () => ({
    meta: buildSeoMeta({
      description:
        "Explore the BYTE QUEST tracks, competition divisions, mentorship workshops, and tournament stages.",
      path: "/programme",
      title: "Programme",
    }),
  }),
  component: ProgrammeRoute,
});
