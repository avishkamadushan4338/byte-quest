import { createFileRoute, redirect } from "@tanstack/react-router";

import { Projects } from "@/components/projects/projects";

const ProjectsRoute = () => <Projects />;

export const Route = createFileRoute("/projects")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Projects | BYTE QUEST" }] }),
  component: ProjectsRoute,
});
