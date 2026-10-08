import { createFileRoute } from "@tanstack/react-router";

import { ComingSoonPage } from "@/components/status/coming-soon-page";
import { buildSeoMeta } from "@/utils/seo";

const ProjectsRoute = () => (
  <ComingSoonPage
    description="Student showcase and innovation projects will be featured here as teams build and publish their solutions."
    heading="Explore the projects, soon."
  />
);

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: buildSeoMeta({
      description:
        "Student showcase and innovation projects built by participants across Sri Lanka during BYTE QUEST.",
      path: "/projects",
      title: "Projects",
    }),
  }),
  component: ProjectsRoute,
});
