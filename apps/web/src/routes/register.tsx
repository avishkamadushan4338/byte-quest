import { createFileRoute } from "@tanstack/react-router";

import { Register } from "@/components/register/wizard";

const RegisterRoute = () => <Register />;

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register | BYTE QUEST" }] }),
  component: RegisterRoute,
});
