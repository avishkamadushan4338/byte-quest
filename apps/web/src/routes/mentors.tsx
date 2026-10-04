import { createFileRoute } from "@tanstack/react-router";

import { Mentors } from "@/components/mentors/mentors";

const MentorsRoute = () => <Mentors />;

export const Route = createFileRoute("/mentors")({
  head: () => ({ meta: [{ title: "Mentors | BYTE QUEST" }] }),
  component: MentorsRoute,
});
