import { createFileRoute, redirect } from "@tanstack/react-router";

import { Programme } from "@/components/programme/programme";

const ProgrammeRoute = () => <Programme />;

export const Route = createFileRoute("/programme")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Programme | BYTE QUEST" }] }),
  component: ProgrammeRoute,
});
