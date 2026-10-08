import { createFileRoute } from "@tanstack/react-router";

import { Mentors } from "@/components/mentors/mentors";
import { buildSeoMeta } from "@/utils/seo";

const MentorsRoute = () => <Mentors />;

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
