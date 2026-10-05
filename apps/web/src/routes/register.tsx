import { createFileRoute, redirect } from "@tanstack/react-router";

import { Register } from "@/components/register/wizard";
import { getUser } from "@/functions/get-user";

const RegisterRoute = () => <Register />;

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
