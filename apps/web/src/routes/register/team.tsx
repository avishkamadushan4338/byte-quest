import { createFileRoute, redirect } from "@tanstack/react-router";

import { BackToSectors } from "@/components/register/back-to-sectors";
import { Register } from "@/components/register/wizard";
import { getUser } from "@/functions/get-user";

const RegisterTeamRoute = () => (
  <>
    <BackToSectors />
    <Register />
  </>
);

export const Route = createFileRoute("/register/team")({
  beforeLoad: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Register your team | BYTE QUEST" }] }),
  component: RegisterTeamRoute,
});
