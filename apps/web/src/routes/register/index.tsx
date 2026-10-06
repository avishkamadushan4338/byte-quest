import { createFileRoute, redirect } from "@tanstack/react-router";

import { SectorSelect } from "@/components/register/sector-select";
import { getUser } from "@/functions/get-user";

const RegisterIndexRoute = () => <SectorSelect />;

export const Route = createFileRoute("/register/")({
  beforeLoad: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Register | BYTE QUEST" }] }),
  component: RegisterIndexRoute,
});
