import { createFileRoute } from "@tanstack/react-router";

import { ComingSoonPage } from "@/components/status/coming-soon-page";

export const Route = createFileRoute("/coming-soon")({
  component: ComingSoonPage,
});
