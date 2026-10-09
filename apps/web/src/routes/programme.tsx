import { createFileRoute } from "@tanstack/react-router";

import { Programme } from "@/components/programme/programme";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const ProgrammeRoute = () => <Programme />;

export const Route = createFileRoute("/programme")({
  head: () => ({
    links: [buildCanonicalLink("/programme")],
    meta: buildSeoMeta({
      description:
        "Explore the BYTE QUEST tracks, competition divisions, mentorship workshops, and tournament stages.",
      path: "/programme",
      title: "Programme",
    }),
  }),
  component: ProgrammeRoute,
});
