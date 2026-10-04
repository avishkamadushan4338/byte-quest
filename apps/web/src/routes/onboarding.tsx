import { createFileRoute, redirect } from "@tanstack/react-router";

import { Onboarding } from "@/components/onboarding/onboarding";
import { getProfile } from "@/functions/get-profile";
import { getUser } from "@/functions/get-user";

const OnboardingRoute = () => <Onboarding />;

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/auth/login" });
    }
    const profile = await getProfile();
    if (profile) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: "Complete your profile | BYTE QUEST" }],
  }),
  component: OnboardingRoute,
});
