import { createFileRoute } from "@tanstack/react-router";

import { VolunteersPanel } from "@/components/admin/volunteers-panel";

export const Route = createFileRoute("/admin/volunteers")({
  head: () => ({ meta: [{ title: "Admin · Volunteers | BYTE QUEST" }] }),
  component: VolunteersPanel,
});
