import { createFileRoute } from "@tanstack/react-router";

import { TeamsPanel } from "@/components/admin/teams-panel";

export const Route = createFileRoute("/admin/teams")({
  head: () => ({ meta: [{ title: "Admin · Teams | BYTE QUEST" }] }),
  component: TeamsPanel,
});
