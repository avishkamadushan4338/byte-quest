import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    links: [buildCanonicalLink("/register")],
    meta: buildSeoMeta({
      description:
        "Register your school team for BYTE QUEST, Sri Lanka's national innovation and coding programme hosted by St. Aloysius' College Galle.",
      path: "/register",
      title: "Register",
    }),
  }),
  component: Outlet,
});
