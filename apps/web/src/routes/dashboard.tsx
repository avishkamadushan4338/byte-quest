import { createFileRoute, redirect } from "@tanstack/react-router";

import { Dashboard } from "@/components/dashboard/dashboard";
import { getProfile } from "@/functions/get-profile";
import { getUser } from "@/functions/get-user";

const DashboardRoute = () => {
  const { me, submission, team } = Route.useLoaderData();
  return <Dashboard me={me} submission={submission} team={team} />;
};

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/auth/login" });
    }
    const profile = await getProfile();
    if (!profile) {
      throw redirect({ to: "/onboarding" });
    }
  },
  head: () => ({ meta: [{ title: "Dashboard | BYTE QUEST" }] }),
  loader: async ({ context }) => ({
    me: await context.orpc.access.me.call(),
    submission: await context.orpc.submissions.mine.call(),
    team: await context.orpc.teams.myTeam.call(),
  }),
  component: DashboardRoute,
});
