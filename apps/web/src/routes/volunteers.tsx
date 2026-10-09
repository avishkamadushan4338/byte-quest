import { createFileRoute } from "@tanstack/react-router";

import { Volunteers } from "@/components/volunteers/volunteers";

const VolunteersRoute = () => <Volunteers />;

export const Route = createFileRoute("/volunteers")({
  component: VolunteersRoute,
});
