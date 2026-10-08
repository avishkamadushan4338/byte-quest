import { createFileRoute } from "@tanstack/react-router";

import { ComingSoonPage } from "@/components/status/coming-soon-page";

const MentorsRoute = () => (
  <ComingSoonPage
    description="Our mentor line-up is being finalised. Get notified when the mentors are announced."
    heading="Meet the mentors, soon."
  />
);

export const Route = createFileRoute("/mentors")({
  head: () => ({ meta: [{ title: "Mentors | BYTE QUEST" }] }),
  component: MentorsRoute,
});
