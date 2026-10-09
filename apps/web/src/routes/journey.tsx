import { createFileRoute } from "@tanstack/react-router";

import { Journey } from "@/components/journey/journey";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const JourneyRoute = () => <Journey />;

export const Route = createFileRoute("/journey")({
  head: () => ({
    links: [buildCanonicalLink("/journey")],
    meta: buildSeoMeta({
      description:
        "The step-by-step roadmap of BYTE QUEST from school registrations and bootcamps to the national finals.",
      path: "/journey",
      title: "Journey & Milestones",
    }),
  }),
  component: JourneyRoute,
});
