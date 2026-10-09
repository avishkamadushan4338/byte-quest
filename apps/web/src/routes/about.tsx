import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/about/about";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const AboutRoute = () => <About />;

export const Route = createFileRoute("/about")({
  head: () => ({
    links: [buildCanonicalLink("/about")],
    meta: buildSeoMeta({
      description:
        "Learn about BYTE QUEST, presented by the Old Boys' Association of St. Aloysius' College Galle (SACOBA) to cultivate digital innovators across Sri Lanka.",
      path: "/about",
      title: "About",
    }),
  }),
  component: AboutRoute,
});
