import { createFileRoute } from "@tanstack/react-router";

import { Programme } from "@/components/programme/programme";

const ProgrammeRoute = () => <Programme />;

export const Route = createFileRoute("/programme")({
  head: () => ({ meta: [{ title: "Programme | BYTE QUEST" }] }),
  component: ProgrammeRoute,
});
