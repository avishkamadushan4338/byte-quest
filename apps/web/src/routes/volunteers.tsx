import { createFileRoute } from "@tanstack/react-router";

import { Volunteers } from "@/components/volunteers/volunteers";

const VolunteersRoute = () => <Volunteers />;

export const Route = createFileRoute("/volunteers")({
  head: () => ({
    meta: [{ title: "Student Volunteers | BYTE QUEST" }],
  }),
  component: VolunteersRoute,
});
