import { createFileRoute } from "@tanstack/react-router";

import { ComingSoonPage } from "@/components/status/coming-soon-page";
import { buildSeoMeta } from "@/utils/seo";

const MentorsRoute = () => (
  <ComingSoonPage
    description="Our mentor line-up is being finalised. Get notified when the mentors are announced."
    heading="Meet the mentors, soon."
  />
);

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: buildSeoMeta({
      description:
        "Meet industry mentors, software architects, and tech leaders guiding students throughout BYTE QUEST.",
      path: "/mentors",
      title: "Mentors",
    }),
  }),
  component: MentorsRoute,
});
