import { createFileRoute } from "@tanstack/react-router";

import { Partners } from "@/components/partners/partners";
import { buildSeoMeta } from "@/utils/seo";

const PartnersRoute = () => <Partners />;

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: buildSeoMeta({
      description:
        "Partner with BYTE QUEST to sponsor prizes, technology access, and career opportunities for young Sri Lankan developers.",
      path: "/partners",
      title: "Partners & Sponsors",
    }),
  }),
  component: PartnersRoute,
});
