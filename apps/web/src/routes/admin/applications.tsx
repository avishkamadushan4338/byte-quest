import { createFileRoute } from "@tanstack/react-router";

import { ApplicationsPanel } from "@/components/admin/applications-panel";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({ meta: [{ title: "Admin · Applications | BYTE QUEST" }] }),
  component: ApplicationsPanel,
});
