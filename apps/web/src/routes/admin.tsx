import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { getProfile } from "@/functions/get-profile";
import { getUser } from "@/functions/get-user";

const AdminRoute = () => (
  <AdminShell>
    <Outlet />
  </AdminShell>
);

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/auth/login" });
    }
    const profile = await getProfile();
    if (!profile) {
      throw redirect({ to: "/onboarding" });
    }
    if (profile.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: "Admin | BYTE QUEST" }],
  }),
  component: AdminRoute,
});
