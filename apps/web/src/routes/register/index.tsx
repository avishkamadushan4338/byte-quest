import { createFileRoute } from "@tanstack/react-router";

import { SectorSelect } from "@/components/register/sector-select";

const RegisterIndexRoute = () => <SectorSelect />;

export const Route = createFileRoute("/register/")({
  component: RegisterIndexRoute,
});
