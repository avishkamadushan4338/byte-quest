import { createFileRoute } from "@tanstack/react-router";

import { Projects } from "@/components/projects/projects";

const ProjectsRoute = () => <Projects />;

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects | BYTE QUEST" }] }),
  component: ProjectsRoute,
});
