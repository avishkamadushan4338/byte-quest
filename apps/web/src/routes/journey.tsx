import { createFileRoute } from "@tanstack/react-router";

import { Journey } from "@/components/journey/journey";

const JourneyRoute = () => <Journey />;

export const Route = createFileRoute("/journey")({
  head: () => ({ meta: [{ title: "Journey | BYTE QUEST" }] }),
  component: JourneyRoute,
});
