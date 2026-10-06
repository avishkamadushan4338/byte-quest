import { createFileRoute, redirect } from "@tanstack/react-router";

import { BackToSectors } from "@/components/register/back-to-sectors";
import { Volunteers } from "@/components/volunteers/volunteers";
import { getUser } from "@/functions/get-user";

const RegisterVolunteerRoute = () => (
  <>
    <BackToSectors />
    <Volunteers />
  </>
);

export const Route = createFileRoute("/register/volunteer")({
  beforeLoad: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Volunteer | BYTE QUEST" }] }),
  component: RegisterVolunteerRoute,
});
