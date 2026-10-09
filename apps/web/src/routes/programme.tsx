import { createFileRoute } from "@tanstack/react-router";

import { Programme } from "@/components/programme/programme";

const ProgrammeRoute = () => <Programme />;

export const Route = createFileRoute("/programme")({
  component: ProgrammeRoute,
});
