import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/about/about";

const AboutRoute = () => <About />;

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About | BYTE QUEST" }] }),
  component: AboutRoute,
});
