import { createFileRoute } from "@tanstack/react-router";

import { Register } from "@/components/register/wizard";

const RegisterTeamRoute = () => <Register />;

export const Route = createFileRoute("/register/team")({
  component: RegisterTeamRoute,
});
