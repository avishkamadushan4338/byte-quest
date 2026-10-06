import { createFileRoute, redirect } from "@tanstack/react-router";

import { RegisterLanding } from "@/components/register/register-landing";
import { getUser } from "@/functions/get-user";

const RegisterRoute = () => <RegisterLanding />;

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Register | BYTE QUEST" }] }),
  component: RegisterRoute,
});
