import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/about/about";

const AboutRoute = () => <About />;

export const Route = createFileRoute("/about")({
  component: AboutRoute,
});
