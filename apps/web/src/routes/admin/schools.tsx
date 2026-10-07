import { createFileRoute } from "@tanstack/react-router";

import { SchoolsPanel } from "@/components/admin/schools-panel";

export const Route = createFileRoute("/admin/schools")({
  head: () => ({ meta: [{ title: "Admin · Schools | BYTE QUEST" }] }),
  component: SchoolsPanel,
});
