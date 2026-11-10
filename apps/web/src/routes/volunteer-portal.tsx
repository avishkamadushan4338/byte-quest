import { createFileRoute } from "@tanstack/react-router";

import { VolunteersClosed } from "@/components/volunteers/volunteers-closed";

export const Route = createFileRoute("/volunteer-portal")({
  head: () => ({ meta: [{ title: "Volunteer | BYTE QUEST" }] }),
  component: VolunteersClosed,
});
