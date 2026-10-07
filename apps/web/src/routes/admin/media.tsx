import { createFileRoute } from "@tanstack/react-router";

import { MediaPanel } from "@/components/admin/media-panel";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Admin · Media | BYTE QUEST" }] }),
  component: MediaPanel,
});
