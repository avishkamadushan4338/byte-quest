import { createFileRoute } from "@tanstack/react-router";

import { ComingSoonPage } from "@/components/status/coming-soon-page";

const ProjectsRoute = () => (
  <ComingSoonPage
    description="Student showcase and innovation projects will be featured here as teams build and publish their solutions."
    heading="Explore the projects, soon."
  />
);

export const Route = createFileRoute("/projects")({
  component: ProjectsRoute,
});
