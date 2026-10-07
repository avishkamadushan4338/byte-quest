import { createFileRoute } from "@tanstack/react-router";

import { SubmissionsPanel } from "@/components/admin/submissions-panel";

export const Route = createFileRoute("/admin/submissions")({
  head: () => ({ meta: [{ title: "Admin · Submissions | BYTE QUEST" }] }),
  component: SubmissionsPanel,
});
