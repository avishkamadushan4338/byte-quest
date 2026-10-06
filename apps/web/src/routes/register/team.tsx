import { createFileRoute } from "@tanstack/react-router";

import { BackToSectors } from "@/components/register/back-to-sectors";
import { Register } from "@/components/register/wizard";

const RegisterTeamRoute = () => (
  <>
    <BackToSectors />
    <Register />
  </>
);

export const Route = createFileRoute("/register/team")({
  head: () => ({ meta: [{ title: "Register your team | BYTE QUEST" }] }),
  component: RegisterTeamRoute,
});
