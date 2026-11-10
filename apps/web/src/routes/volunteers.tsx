import { createFileRoute } from "@tanstack/react-router";

import { VolunteersClosed } from "@/components/volunteers/volunteers-closed";

export const Route = createFileRoute("/volunteers")({
  component: VolunteersClosed,
});
