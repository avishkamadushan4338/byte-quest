import { createFileRoute } from "@tanstack/react-router";

import { Partners } from "@/components/partners/partners";

const PartnersRoute = () => <Partners />;

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [{ title: "Partners & Sponsors | BYTE QUEST" }],
  }),
  component: PartnersRoute,
});
