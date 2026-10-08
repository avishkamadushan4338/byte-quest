import { createFileRoute } from "@tanstack/react-router";

import { Volunteers } from "@/components/volunteers/volunteers";
import { buildSeoMeta } from "@/utils/seo";

const VolunteersRoute = () => <Volunteers />;

export const Route = createFileRoute("/volunteers")({
  head: () => ({
    meta: buildSeoMeta({
      description:
        "Join the crew behind BYTE QUEST. Apply as a student volunteer to create, present, design and run Sri Lanka's premier school tech quest.",
      path: "/volunteers",
      title: "Student Volunteers",
    }),
  }),
  component: VolunteersRoute,
});
