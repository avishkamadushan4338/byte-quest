import { createFileRoute } from "@tanstack/react-router";

import { UsersPanel } from "@/components/admin/users-panel";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Admin · Users | BYTE QUEST" }] }),
  component: UsersPanel,
});
