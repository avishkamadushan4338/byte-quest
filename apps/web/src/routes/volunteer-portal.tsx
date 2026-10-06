import { createFileRoute, redirect } from "@tanstack/react-router";

import { VolunteerPortal } from "@/components/volunteers/volunteer-portal";
import { getProfile } from "@/functions/get-profile";
import { getUser } from "@/functions/get-user";

const VolunteerPortalRoute = () => {
  const { application } = Route.useLoaderData();
  return <VolunteerPortal application={application} />;
};

export const Route = createFileRoute("/volunteer-portal")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/auth/login" });
    }
    const profile = await getProfile();
    if (!profile) {
      throw redirect({ to: "/onboarding" });
    }
    if (profile.role !== "volunteer") {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Volunteer | BYTE QUEST" }] }),
  loader: async ({ context }) => ({
    application: await context.orpc.volunteers.mine.call(),
  }),
  component: VolunteerPortalRoute,
});
