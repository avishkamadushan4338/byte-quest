import { createFileRoute } from "@tanstack/react-router";

import { AdminApplication } from "@/components/admin-application/admin-application";

const ApplyAdminRoute = () => <AdminApplication />;

export const Route = createFileRoute("/apply-admin")({
  head: () => ({ meta: [{ title: "Apply for admin access | BYTE QUEST" }] }),
  component: ApplyAdminRoute,
});
