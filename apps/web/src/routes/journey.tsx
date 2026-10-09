import { createFileRoute } from "@tanstack/react-router";

import { Journey } from "@/components/journey/journey";

const JourneyRoute = () => <Journey />;

export const Route = createFileRoute("/journey")({
  component: JourneyRoute,
});
